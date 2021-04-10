import React, { useContext, useEffect, useState } from 'react';
import './Chat.scss';
import { socket } from '../../../helpers/Socket';
import Input from '../input/Input';
import Button from '../button/Button';
import { AppContext } from '../../context/AppContext';

function Chat() {
    const [inputValue, setInputValue] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    const { user } = useContext(AppContext);

    const messageComponents = allMessages.map((msg, index) => {
        const fromMe = user.displayName === msg.sender;
        const showLabel = index > 0 && allMessages[index - 1].sender === msg.sender;

        return (
            <div className={ `message ${fromMe ? '' : ' opponent'}` }>
                { showLabel ? <label>{ fromMe ? 'You:' : `${msg.sender}:` }</label> : null }
                <p>{msg.message}</p>
            </div>
        )
    });

    useEffect(() => {
        socket.on('message', message => setAllMessages([...allMessages, message]));
    }, []);

    function sendMessage() {
        if (!inputValue) return;
        socket.emit('message', { sender: user.displayName, message: inputValue });
    }

    return (
        <div className='Chat'>
            <h3>CHAT WITH OPPONENT ...</h3>
            <section>
                { messageComponents }
            </section>
            <div className='input_section'>
                <Input id='message_input' placeholder='Aa' changeState={[ inputValue, setInputValue ]} />
                <Button color='primary'>SEND</Button>
            </div>
        </div>
    )
}

export default Chat;

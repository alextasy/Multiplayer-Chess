import React, { useContext, useEffect, useRef, useState } from 'react';
import './Chat.scss';
import { socket } from '../../../helpers/Socket';
import Input from '../input/Input';
import Button from '../button/Button';
import { AppContext } from '../../context/AppContext';
import { GameContext } from '../../context/GameContext';

function Chat({ initialMsg }) {
    const [inputValue, setInputValue] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    const { user } = useContext(AppContext);
    const { roomId } = useContext(GameContext);
    const sectionRef = useRef();

    const messageComponents = allMessages.map((msg, index) => {
        const fromMe = user.displayName === msg.sender;
        const hideLabel = index > 0 && allMessages[index - 1].sender === msg.sender;

        return (
            <div className={ `message ${fromMe ? 'you' : ' opponent'}` } key={ index }>
                <p>
                    { hideLabel ? null : <label>{ fromMe ? 'You:' : `${msg.sender}:` }</label> }
                    {msg.message}
                </p>
            </div>
        )
    });

    useEffect(()=> { socket.on('message', message => setAllMessages(currentMsg => [...currentMsg, message])) }, []);
    useEffect(()=> { sectionRef.current.scrollTop = sectionRef.current.scrollHeight }, [allMessages]);

    function sendMessage() {
        if (!inputValue) return;
        socket.emit('message', { sender: user.displayName, message: inputValue, roomId });
        setInputValue('');
    }

    return (
        <div className='Chat'>
            <h3>CHAT WITH OPPONENT ...</h3>
            <section ref={ sectionRef }>
                <span style={{ fontSize: '14px' }}>{ initialMsg }</span>
                { messageComponents }
            </section>
            <div className='input_section'>
                <Input id='message_input' placeholder='Aa' changeState={[ inputValue, setInputValue ]} />
                <Button color='primary' click={ sendMessage }>SEND</Button>
            </div>
        </div>
    )
}

export default Chat;

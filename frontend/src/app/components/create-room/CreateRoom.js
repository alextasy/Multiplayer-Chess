import React, { useState } from 'react';
import Button from '../button/Button';
import Input from '../input/Input';
import Radio from '../radio/Radio';
import Checkbox from '../checkbox/Checkbox';
import './CreateRoom.scss';

function CreateRoom({ createFunc, rooms }) {
    const [name, setName] = useState({ value: '', invalidMsg: '' });
    const [password, setPassword] = useState('');
    const [blitz, setBlitz] = useState(10);
    const [startingAsBlack, setStartingAsBlack] = useState(false);

    function validate() {
        if (!name.value) return setName({ ...name, invalidMsg: '* Field is required' });
        if (name.value.length < 5) return setName({ ...name, invalidMsg: '* Minimum length is 5 characters' });
        if (rooms.some(room => room.name === name.value)) return setName({ ...name, invalidMsg: '* Name is taken' });
        createFunc({ name: name.value, password, blitz, creatorIsBlack: startingAsBlack });
    }

    return (
        <div className='CreateRoom'>
            <h3>CREATE A ROOM ...</h3>
            <Input
                id='create_room_name'
                placeholder='* Required'
                changeState={[ name.value, value => setName({ value, invalidMsg: null }) ]}
                invalidMsg={ name.invalidMsg }>NAME</Input>
            <Input
                id='create_room_pass'
                placeholder='* Optional'
                changeState={[ password, setPassword ]}>PASSWORD</Input>
            <h3>BLITZ MODE</h3>
            <div className='radio'>
                <Radio id='10 MIN' name='blitz' condition={ blitz === 10 } change={ ()=> setBlitz(10) }>10 MIN</Radio>
                <Radio id='5 MIN' name='blitz' condition={ blitz === 5 } change={ ()=> setBlitz(5) }>5 MIN</Radio>
                <Radio id='3 MIN' name='blitz' condition={ blitz === 3 } change={ ()=> setBlitz(3) }>3 MIN</Radio>
                <Radio id='NO LIM' name='blitz' condition={ blitz === 0 } change={ ()=> setBlitz(0) }>NO LIM</Radio>
            </div>
            <div className='last'>
                <Checkbox click={ ()=> setStartingAsBlack(!startingAsBlack) }/>
                <label>START AS BLACK</label>
                <Button color='primary' click={ validate }>CREATE ROOM</Button>
            </div>
        </div>
    )
}

export default CreateRoom

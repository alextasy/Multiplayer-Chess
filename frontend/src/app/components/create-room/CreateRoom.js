import React, { useState } from 'react';
import Button from '../button/Button';
import Input from '../input/Input';
import Radio from '../radio/Radio';
import Checkbox from '../checkbox/Checkbox';
import './CreateRoom.scss';

function CreateRoom({ createFunc }) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [blitz, setBlitz] = useState(10);
    const [startingAsBlack, setStartingAsBlack] = useState(false);

    return (
        <div className='CreateRoom'>
            <h3>CREATE A ROOM ...</h3>
            <Input
                id='create_room_name'
                placeholder='* Required'
                changeState={[ name, setName ]}>NAME</Input>
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
                <Button color='primary' click={ () => createFunc( { name, password, blitz, startingAsBlack }) }>CREATE ROOM</Button>
            </div>
        </div>
    )
}

export default CreateRoom

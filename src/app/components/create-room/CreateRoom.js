import React, { useContext, useState } from 'react';
import Button from '../button/Button';
import Input from '../input/Input';
import Checkbox from '../checkbox/Checkbox';
import './CreateRoom.scss';
import { AppContext } from '../../context/AppContext';

function CreateRoom({ createFunc, rooms }) {
    const [name, setName] = useState({ value: '', invalidMsg: '' });
    const [password, setPassword] = useState('');
    const [startingAsBlack, setStartingAsBlack] = useState(false);
    const { userUuid } = useContext(AppContext);

    function validate() {
        if (!name.value) return setName({ ...name, invalidMsg: '* Field is required' });
        if (name.value.length < 5) return setName({ ...name, invalidMsg: '* Minimum length is 5 characters' });
        if (rooms.some(room => room.name === name.value)) return setName({ ...name, invalidMsg: '* Name is taken' });
        createFunc({ name: name.value, password, creatorIsBlack: startingAsBlack, creatorId: userUuid });
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
            <div className='player-color'>
                <Checkbox state={ startingAsBlack } setState={ setStartingAsBlack } />
                <label onClick={ ()=> setStartingAsBlack(!startingAsBlack) }>START AS BLACK</label>
            </div>
            <Button color='primary' click={ validate }>CREATE ROOM</Button>
        </div>
    )
}

export default CreateRoom

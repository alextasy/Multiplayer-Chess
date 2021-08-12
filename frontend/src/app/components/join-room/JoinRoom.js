import React, { useEffect, useState } from 'react';
import './JoinRoom.scss';
import Input from '../input/Input';
import Button from '../button/Button';
import padlock from '../../../assets/icons/padlock.png';
import padlockLocked from '../../../assets/icons/padlock_locked.png';
import padlockUnlocked from '../../../assets/icons/padlock_unlocked.png';

function JoinRoom({ rooms, joinFunc }) {
    const [searchText, setSearchText] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    const passwordInput = <div className='password_input'>
        <input
            type='text'
            value={ password }
            onChange={ (e) => setPassword(e.target.value) }
            placeholder='Enter password' />
    </div>

    const roomComponents = rooms.map( room =>
        <div className='room' id={ room.id } key={ room.id }>
            <div className='info'>
                <span>{ room.name }</span>
                <span>{ room.blitz ? room.blitz : 'NO LIM' }</span>
                <img
                    src={ room.password ? padlockLocked : padlockUnlocked }
                    alt={ `${room.password ? 'locked' : 'unlocked'}padlock` }/>
            </div>
            <Button color='primary' click={ ()=> validateJoin(room) }>JOIN</Button>
            { passwordInput }
        </div>
    );

    function validateJoin(room) {
        if (room.password === password) return joinFunc(room.id, room.creatorIsBlack);
        if (selectedRoomId && selectedRoomId !== room.id) toggleClass(selectedRoomId);
        setSelectedRoomId(room.id);
    }

    useEffect(() => {
        if (!selectedRoomId) return;
        toggleClass(selectedRoomId);
    }, [selectedRoomId])

    function toggleClass(id) {
        document.getElementById(id).classList.toggle('active');
    }

    return (
        <div className='JoinRoom'>
            <h3>JOIN A ROOM ...</h3>
            <div className='search_container'>
                <Input id='search' changeState={[ searchText, setSearchText ]} placeholder='Aa'></Input>
                <Button color='primary'>SEARCH</Button>
            </div>
            <div className='properties'>
                <h3>NAME</h3>
                <h3>BLITZ</h3>
                <img src={ padlock } alt='Padlock'/>
            </div>
            <section>
                { roomComponents.length ? roomComponents : <div className='no-rooms'>No rooms are available currently</div> }
            </section>

        </div>
    )
}

export default JoinRoom;

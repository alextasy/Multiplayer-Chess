import React, { useEffect, useState } from 'react';
import './JoinRoom.scss';
import Input from '../input/Input';
import Button from '../button/Button';
import padlock from '../../../assets/icons/padlock.png';
import padlockLocked from '../../../assets/icons/padlock_locked.png';
import padlockUnlocked from '../../../assets/icons/padlock_unlocked.png';

function JoinRoom({ rooms, joinFunc }) {
    const [searchText, setSearchText] = useState('');
    const [lastSearchedText, setLastSearchedText] = useState('');
    const [password, setPassword] = useState('');
    const [passwordIsWrong, setPasswordIsWrong] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [filteredRooms, setFilteredRooms] = useState([]);

    useEffect(()=> {
        filterRooms()
    }, [rooms]);

    const passwordInput = <div className='password_input'>
        <input
            type='text'
            value={ password }
            onKeyDown={ e => e.key === 'Enter' && validateJoin(rooms.find(room => room.id === selectedRoomId)) }
            onChange={ handlePasswordChange }
            placeholder='Enter password' />
            { passwordIsWrong ? <div className='invalid-message'>* Wrong password</div> : null }
    </div>

    const roomComponents = filteredRooms.map( room =>
        <div className='room' id={ room.id } key={ room.id }>
            <div className='info'>
                <span>{ room.name }</span>
                <img
                    src={ room.password ? padlockLocked : padlockUnlocked }
                    alt={ `${room.password ? 'locked' : 'unlocked'}padlock` }/>
            </div>
            <Button color='primary' click={ ()=> validateJoin(room) }>JOIN</Button>
            { passwordInput }
        </div>
    );

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setPasswordIsWrong(false);
    }

    function validateJoin(room) {
        if (room.password === password) return joinFunc(room.id, room.creatorIsBlack);
        if (selectedRoomId && selectedRoomId !== room.id) {
            setPassword('');
            setPasswordIsWrong(false);
            toggleClass(selectedRoomId);
        }
        if (selectedRoomId && selectedRoomId === room.id) {
            setPasswordIsWrong(true);
            return;
        }
        setSelectedRoomId(room.id);
    }

    useEffect(() => {
        if (!selectedRoomId) return;
        toggleClass(selectedRoomId);
    }, [selectedRoomId])

    function toggleClass(id) {
        document.getElementById(id).classList.toggle('active');
    }

    function filterRooms() {
        setSelectedRoomId(null);
        setLastSearchedText(searchText);
        const filteredRooms = rooms.filter(room => room.name.toLowerCase().includes(searchText));
        setFilteredRooms(filteredRooms);
    }

    return (
        <div className='JoinRoom'>
            <h3>JOIN A ROOM ...</h3>
            <div className='search_container'>
                <Input enterPressed={ filterRooms } id='search' changeState={[ searchText, setSearchText ]} placeholder='Aa'></Input>
                <Button click={ filterRooms } color='primary'>SEARCH</Button>
            </div>
            <div className='properties'>
                <h3>NAME</h3>
                <img src={ padlock } alt='Padlock'/>
            </div>
            <section>
                { roomComponents.length ? roomComponents : <div className='no-rooms'>{ lastSearchedText ? `No rooms with a name that includes: ${lastSearchedText}` : 'No rooms are available currently' }</div> }
            </section>

        </div>
    )
}

export default JoinRoom;

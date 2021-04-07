import React, { useState } from 'react';
import './JoinRoom.scss';
import Input from '../input/Input';
import Button from '../button/Button';
import padlock from '../../../assets/icons/padlock.png';
import padlockLocked from '../../../assets/icons/padlock_locked.png';
import padlockUnlocked from '../../../assets/icons/padlock_unlocked.png';

function JoinRoom() {
    const [searchText, setSearchText] = useState('');
    const rooms =
        <div className='room'>
            <div className='info'>
                <span>Alex's room</span>
                <span>5 MIN</span>
                <img src={ padlockLocked } alt='Locked padlock'/>
            </div>
            <Button color='primary'>JOIN</Button>
        </div>

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
                { rooms }
            </section>

        </div>
    )
}

export default JoinRoom;

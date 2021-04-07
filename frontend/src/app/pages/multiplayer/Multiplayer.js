import React from 'react';
import Aside from '../../components/aside/Aside';
import Board from '../../components/board/Board';
import JoinRoom from '../../components/join-room/JoinRoom';
import './Multiplayer.scss';

function Multiplayer() {
    return (
        <div className='Multiplayer'>
            <Board />
            <Aside>
                <JoinRoom />
            </Aside>
        </div>
    )
}

export default Multiplayer;

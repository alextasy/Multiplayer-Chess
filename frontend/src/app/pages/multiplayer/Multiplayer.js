import React from 'react';
import Aside from '../../components/aside/Aside';
import Board from '../../components/board/Board';
import './Multiplayer.scss';

function Multiplayer() {
    return (
        <div className='Multiplayer'>
            <Board />
            <Aside>

            </Aside>
        </div>
    )
}

export default Multiplayer;

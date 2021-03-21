import React from 'react';
import Board from '../../components/board/Board';
import MovesHistory from '../../components/moves-history/MovesHistory';
import './Local.scss';

function Local() {
    return (
        <div className='Local'>
            <Board />
            <aside>
                <MovesHistory ></MovesHistory>
            </aside>
        </div>
    )
}

export default Local;

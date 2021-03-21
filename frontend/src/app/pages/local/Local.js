import React from 'react';
import Board from '../../components/board/Board';
import Checkbox from '../../components/checkbox/Checkbox';
import MovesHistory from '../../components/moves-history/MovesHistory';
import './Local.scss';

function Local() {
    return (
        <div className='Local'>
            <Board />
            <aside>
                <MovesHistory ></MovesHistory>
                <div className='controls'>
                    <Checkbox click={()=>{}} checkedInitially={true}></Checkbox>
                    <label>Auto-rotate</label>
                </div>
            </aside>
        </div>
    )
}

export default Local;

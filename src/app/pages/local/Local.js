import React, { useState } from 'react';
import Board from '../../components/board/Board';
import Checkbox from '../../components/checkbox/Checkbox';
import MovesHistory from '../../components/moves-history/MovesHistory';
import Button from '../../components/button/Button';
import Aside from '../../components/aside/Aside';
import './Local.scss';

function Local() {
    const [playingAsBlack, setPlayingAsBlack] = useState(false);
    const [autoRotate, setAutoRotate] = useState(false);
    const [key, SetKey] = useState(new Date().getTime()); // Setting unique key resets the state

    return (
        <div className='Local'>
            <Board key={key} playingAsBlack={ playingAsBlack } autoRotate= { autoRotate } handleGameOver={ () => { SetKey(new Date().getTime()) } } />
            <Aside>
                <MovesHistory ></MovesHistory>
                <div className='controls'>
                    <Button color='highlight' click={ () => setPlayingAsBlack(!playingAsBlack) }>Rotate</Button>
                    <Checkbox state={ autoRotate } setState={ setAutoRotate }></Checkbox>
                    <label onClick={ () => setAutoRotate(!autoRotate) }>Auto-rotate</label>
                </div>
            </Aside>
        </div>
    )
}

export default Local;

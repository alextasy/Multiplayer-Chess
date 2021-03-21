import React, { useState } from 'react';
import Board from '../../components/board/Board';
import Checkbox from '../../components/checkbox/Checkbox';
import MovesHistory from '../../components/moves-history/MovesHistory';
import Button from '../../components/button/Button';
import './Local.scss';

function Local() {
    const [playingAsBlack, setPlayingAsBlack] = useState(false);
    const [autoRotate, setAutoRotate] = useState(false);

    return (
        <div className='Local'>
            <Board playingAsBlack={ playingAsBlack } autoRotate= { autoRotate }/>
            <aside>
                <MovesHistory ></MovesHistory>
                <div className='controls'>
                    <Checkbox click={ ()=> setAutoRotate(!autoRotate) } checkedInitially={ false }></Checkbox>
                    <label>Auto-rotate</label>
                    <Button color='highlight' click={ () => setPlayingAsBlack(!playingAsBlack) }>Rotate</Button>
                </div>
            </aside>
        </div>
    )
}

export default Local;

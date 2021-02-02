import React, { useState } from 'react';
import './Board.scss';

function initialSetUp() {
    const arr = [];
    let colorShouldInverse = false;

    for (let i = 1; i <= 64; i++) {
        const square = {};

        square.color = i % 2 === Number(colorShouldInverse) ? '#537133' : '#ebebeb';
        square.position = i;
        square.occupiedBy = null;
        arr.push(square);

        if (i % 8 === 0) colorShouldInverse = !colorShouldInverse;
    }
    return arr;
}

function Board() {
    const [gameBoardState, setGameBoardState] = useState(initialSetUp());

    const gameBoard = gameBoardState.map(square => (
        <div className='square' style={{backgroundColor: square.color}} key={square.position}>
            {square.occupiedBy ? <img src={square.occupiedBy.img.src} alt={square.occupiedBy.img.alt}></img> : null}
        </div>));

    return (
        <div className='Board'>
            {gameBoard}
        </div>
    )
}

export default Board;

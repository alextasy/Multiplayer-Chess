import React, { useState } from 'react';
import Square from './board-logic/square';
import './Board.scss';

function initialSetUp() {
    const arr = [];
    let colorShouldInverse = false;

    for (let i = 1; i <= 64; i++) {
        const square = new Square(i, i % 2 === Number(colorShouldInverse) ? '#537133' : '#ebebeb');
        arr.push(square);
        if (i % 8 === 0) colorShouldInverse = !colorShouldInverse;
    }
    return arr;
}

function Board({ playerIsBlack }) {
    const [gameBoardState, setGameBoardState] = useState(initialSetUp());
    const [selectedFigure, setSelectedFigure] = useState(null);
    const [isMyTurn, setIsMyTurn] = useState(playerIsBlack ? false : true);
    const [gameIsOver, setGameIsOver] = useState(null);

    function selectFigure(square) {
        console.log(square);
    }

    function moveFigure(square) {
        console.log(square);
    }


    const gameBoard = gameBoardState.map(square => (
        <div
            className='square'
            style={{ backgroundColor: square.color }}
            key={ square.position }
            onClick={ () => selectedFigure ? moveFigure(square) : selectFigure(square) }
            >
            { square.occupiedBy ?
                <img
                    src={ square?.occupiedBy?.img?.src }
                    alt={ square?.occupiedBy?.img?.alt }
                    style={{ transform: playerIsBlack ? 'rotate(180deg)' : null }}>
                </img> : null }
        </div>));

    return (
        <div className='Board' style={{ transform: playerIsBlack ? 'rotate(180deg)' :null }}>
            { gameBoard }
        </div>
    )
}

export default Board;

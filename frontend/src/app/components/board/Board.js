import React, { useState } from 'react';
import './Board.scss';
import Figure from './board-logic/figure';

import bPawn from '../../../assets/figure-images/b-pawn.png';
import bBishop from '../../../assets/figure-images/b-bishop.png';
import bKnight from '../../../assets/figure-images/b-knight.png';
import bKing from '../../../assets/figure-images/b-king.png';
import bQueen from '../../../assets/figure-images/b-queen.png';
import bRook from '../../../assets/figure-images/b-rook.png';
import wPawn from '../../../assets/figure-images/w-pawn.png';
import wBishop from '../../../assets/figure-images/w-bishop.png';
import wKnight from '../../../assets/figure-images/w-knight.png';
import wKing from '../../../assets/figure-images/w-king.png';
import wQueen from '../../../assets/figure-images/w-queen.png';
import wRook from '../../../assets/figure-images/w-rook.png';

function initialSetUp() {
    const arr = [];
    let colorShouldInverse = false;

    for (let i = 1; i <= 64; i++) {
        const square = {};

        square.color = i % 2 === Number(colorShouldInverse) ? '#537133' : '#ebebeb';
        square.position = i;

        if (i === 1 || i === 8) square.occupiedBy = new Figure('black', 'rook', { src: bRook, alt: 'Black rook' }, i);
        if (i === 2 || i === 7) square.occupiedBy = new Figure('black', 'knight', { src: bKnight, alt: 'Black knight' }, i);
        if (i === 3 || i === 6) square.occupiedBy = new Figure('black', 'bishop', { src: bBishop, alt: 'Black bishop' }, i);
        if (i === 4) square.occupiedBy = new Figure('black', 'queen', { src: bQueen, alt: 'Black queen' }, i);
        if (i === 5) square.occupiedBy = new Figure('black', 'king', { src: bKing, alt: 'Black king' }, i);
        if  (i > 8 && i <= 16) square.occupiedBy = new Figure('black', 'pawn', { src: bPawn, alt: 'Black pawn' }, i);

        if  (i > 48 && i <= 56) square.occupiedBy = new Figure('white', 'pawn', { src: wPawn, alt: 'White pawn' }, i);
        if (i === 57 || i === 64) square.occupiedBy = new Figure('white', 'rook', { src: wRook, alt: 'White rook' }, i);
        if (i === 58 || i === 63) square.occupiedBy = new Figure('white', 'knight', { src: wKnight, alt: 'White knight' }, i);
        if (i === 59 || i === 62) square.occupiedBy = new Figure('white', 'bishop', { src: wBishop, alt: 'White bishop' }, i);
        if (i === 60) square.occupiedBy = new Figure('white', 'queen', { src: wQueen, alt: 'White queen' }, i);
        if (i === 61) square.occupiedBy = new Figure('white', 'king', { src: wKing, alt: 'White king' }, i);

        if (!square.occupiedBy) square.occupiedBy = null;
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

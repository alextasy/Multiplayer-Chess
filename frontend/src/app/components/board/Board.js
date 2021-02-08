import React, { useState } from 'react';
import Square from './board-elements/square';
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

function Board({ playerIsBlack, isMyTurn = true, playable = true }) {
    const [gameBoard, setGameBoard] = useState(initialSetUp());
    const [selectedFigure, setSelectedFigure] = useState(null);
    const [currentTurn, setCurrentTurn] = useState('white');
    const [gameIsOver, setGameIsOver] = useState(null);
    const [availableMoves, setAvailableMoves] = useState (null);

    function selectFigure(square) {
        if (square.occupiedBy?.color !== currentTurn || !isMyTurn) return;
        console.log(square);

        toggleSelectedStyles(square.occupiedBy);
        setSelectedFigure(square.occupiedBy);
        setAvailableMoves(square.occupiedBy.getAvailableMoves(gameBoard));
    }

    function moveFigure(square) {
        toggleSelectedStyles(selectedFigure);

        if (square.position !== selectedFigure.position && square.occupiedBy?.color === currentTurn) {
            selectFigure(square);
            return;
        }
        if (square.position === selectedFigure.position || !availableMoves.includes(square.position)) {
            setSelectedFigure(null);
            setAvailableMoves(null);
            return;
        }
        const gameBoardCopy = [...gameBoard];
        gameBoardCopy[selectedFigure.position -1].occupiedBy = null;
        selectedFigure.position = square.position;
        gameBoardCopy[square.position -1].occupiedBy = selectedFigure;
        setSelectedFigure(null);
        setAvailableMoves(null);
        setGameBoard(gameBoardCopy);
    }

    function toggleSelectedStyles(figure) {
        const toggleClass = (className, id) => document.getElementById(id).classList.toggle(className);
        const positions = figure.getAvailableMoves(gameBoard);
        toggleClass('selected', figure.position);
        positions.forEach(position => {
            if (gameBoard[position -1].occupiedBy) toggleClass('potential-move-take', position);
            else toggleClass('potential-move', position)
        });
    }

    const gameBoardElement = gameBoard.map(square => (
        <div
            className='square'
            style={{ backgroundColor: square.color }}
            id= { square.position }
            key={ square.position }
            onClick={ () => {
                if (!playable) return;
                selectedFigure ? moveFigure(square) : selectFigure(square) }
            }>
            {
                square.occupiedBy ?
                <img
                    src={ square?.occupiedBy?.img?.src }
                    alt={ square?.occupiedBy?.img?.alt }
                    style={{ transform: playerIsBlack ? 'rotate(180deg)' : null }}>
                </img> : null
            }
        </div>));

    return (
        <div className='Board' style={{ transform: playerIsBlack ? 'rotate(180deg)' :null }}>
            { gameBoardElement }
        </div>
    )
}

export default Board;

import React, { useRef, useState } from 'react';
import './Board.scss';
import { withRouter } from 'react-router-dom';
import { initialSetUp, setFigures } from './boardHelper';

function Board({ playerIsBlack, isMyTurn = true, playable = true, location }) {
    const [gameBoard, setGameBoard] = useState(initialSetUp());
    const [selectedFigure, setSelectedFigure] = useState(null);
    const [currentTurn, setCurrentTurn] = useState('white');
    const [gameIsOver, setGameIsOver] = useState(null);
    const [availableMoves, setAvailableMoves] = useState (null);
    const isLocal = useRef(location.pathname === '/local');
    const [blackFigures, setBlackFigures] = useState(setFigures('black'));
    const [whiteFigures, setWhiteFigures] = useState(setFigures('white'));

    function selectFigure(square) {
        if (square.occupiedBy?.color !== currentTurn || !isMyTurn) return;
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
        if (square.occupiedBy) {
           if (currentTurn === 'white') setBlackFigures(blackFigures.filter(figure => figure !== square.occupiedBy));
           else setWhiteFigures(whiteFigures.filter(figure => figure !== square.occupiedBy));
        }
        gameBoardCopy[selectedFigure.position -1].occupiedBy = null;
        selectedFigure.position = square.position;
        gameBoardCopy[square.position -1].occupiedBy = selectedFigure;
        setSelectedFigure(null);
        setAvailableMoves(null);
        setGameBoard(gameBoardCopy);
        switchTurn();
        console.log({blackFigures: blackFigures, whiteFigures: whiteFigures});
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

    function switchTurn() {
        if (isLocal) {
            setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
            return;
        }
    }

    const gameBoardElement = gameBoard.map(square => (
        <div
            className='square'
            style={{ backgroundColor: square.color }}
            id={ square.position }
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

export default withRouter(Board);

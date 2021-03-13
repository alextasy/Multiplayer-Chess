import React, { useRef, useState } from 'react';
import './Board.scss';
import { withRouter } from 'react-router-dom';
import { initialSetUp, setFigures } from './boardHelper';

function Board({ playerIsBlack, isMyTurn = true, playable = true, location }) {
    const [gameBoard, setGameBoard] = useState(initialSetUp());
    const [selectedFigure, setSelectedFigure] = useState(null);
    const [currentTurn, setCurrentTurn] = useState('white');
    const [availableMoves, setAvailableMoves] = useState (null);
    const isLocal = useRef(location.pathname === '/local');
    const [blackFigures, setBlackFigures] = useState(setFigures('black'));
    const [whiteFigures, setWhiteFigures] = useState(setFigures('white'));
    const [checkedPlayer, setCheckedPlayer] = useState(null);

    if (checkedPlayer) {
        let hasLegalMoves = false;
        const checkAllLegalMoves = figures => {
            figures.forEach(fig => {
                if (getFigureLegalMoves(fig).length > 0) hasLegalMoves = true;
            });
        }
        if (currentTurn === 'black') checkAllLegalMoves(blackFigures);
        else checkAllLegalMoves(whiteFigures);
        if (!hasLegalMoves) console.log('GG');
        else setCheckedPlayer(false);
    }

    function getFigureLegalMoves(figure) {
        let availablePositions = figure.getDefaultMoves(gameBoard);
        availablePositions.forEach(potentialPositon => {
            const boardCopy = [...gameBoard].map(square => Object.create(square)); //Get a deep copy
            boardCopy[figure.position - 1].occupiedBy = null;
            boardCopy[potentialPositon - 1].occupiedBy = figure;
            const checkAllEnemyMoves = figures => {
                figures.forEach(fig => {
                    if (potentialPositon === fig.position) return; // Meaning we can take the attacking figure
                    if (seeIfCheck(boardCopy, fig)) availablePositions = availablePositions.filter(position => position !== potentialPositon);
                });
            }
            currentTurn === 'black' ? checkAllEnemyMoves(whiteFigures) : checkAllEnemyMoves(blackFigures);
        });
        return availablePositions;
    }

    function selectFigure(square) {
        if (square.occupiedBy?.color !== currentTurn || !isMyTurn) return;
        toggleSelectedStyles(square.occupiedBy);
        setSelectedFigure(square.occupiedBy);
        setAvailableMoves(getFigureLegalMoves(square.occupiedBy));
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
        document.querySelector('.checked')?.classList.remove('checked');
        gameBoardCopy[selectedFigure.position -1].occupiedBy = null;
        selectedFigure.position = square.position;
        gameBoardCopy[square.position -1].occupiedBy = selectedFigure;
        if (seeIfCheck(gameBoardCopy, square.occupiedBy, true)) setCheckedPlayer(true);
        setSelectedFigure(null);
        setAvailableMoves(null);
        setGameBoard(gameBoardCopy);
        switchTurn();
    }

    function seeIfCheck(board, figure, shouldPaintOnCheck = false) {
        const nextPositions = figure.getDefaultMoves(board);
        let check = false;
        nextPositions.forEach(position => {
            if (board[position - 1].occupiedBy?.type === 'king') {
                if (shouldPaintOnCheck) document.getElementById(position).classList.add('checked');
                check = true;
            }
        });
        return check;
    }

    function toggleSelectedStyles(figure) {
        const toggleClass = (className, id) => document.getElementById(id).classList.toggle(className);
        const positions = getFigureLegalMoves(figure);
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

    return (
        <div className='Board' style={{ transform: playerIsBlack ? 'rotate(180deg)' :null }}>
            { gameBoard.map(square => (
                <div className='square'
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
                </div>))
            }
        </div>
    )
}

export default withRouter(Board);

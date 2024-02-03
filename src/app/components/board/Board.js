import React, { useContext, useEffect, useState } from 'react';
import './Board.scss';
import { useLocation } from 'react-router-dom';
import { initialSetUp, setFigures, rankElements, promotionModal, handleCastling, handlePawnPromotion, checkGameOver, gameOverModal } from './boardHelper';
import { GameContext } from '../../context/GameContext';
import { socket } from '../../../helpers/Socket';
import { AppContext } from '../../context/AppContext';

function Board({ playingAsBlack, playable = true, autoRotate, handleGameOver }) {
    const [gameBoard, setGameBoard] = useState(initialSetUp());
    const [blackFigures, setBlackFigures] = useState(setFigures(gameBoard, 'black'));
    const [whiteFigures, setWhiteFigures] = useState(setFigures(gameBoard, 'white'));
    const [selectedFigure, setSelectedFigure] = useState(null);
    const [availableMoves, setAvailableMoves] = useState (null);

    const [currentTurn, setCurrentTurn] = useState('white');
    const [promoModalState, setPromoModalState] = useState(null);
    const [gameOverModalState, setGameOverModalState] = useState(null);

    const [playerIsBlack, setPlayerIsBlack] = useState(playingAsBlack);
    const location = useLocation();
    const [isLocal] = useState(location.pathname === '/local');
    const { roomId, setMovesHistory, inGame } = useContext(GameContext);
    const { userUuid } = useContext(AppContext);
    const [receivedMove, setReceivedMove] = useState(null);
    const [lastMove, setLastMove] = useState({ id: 0 });

    useEffect(()=> setMovesHistory([]), []);

    useEffect(()=> {
        if (!inGame) return;
        socket.on('move', executeReceivedMove);
        socket.on('verifyLastMove', ({ figIndex, nextSquareIndex, id }) => {
            if (id < lastMove.id) {
                socket.emit('move', { move: { figIndex, nextSquareIndex, id: lastMove.id + 1 }, roomId });
                return;
            }
            if (lastMove.id === id) return;
            executeReceivedMove({ figIndex, nextSquareIndex, id });
        });
        socket.on('playerDisconnected', disconnectedPlayerId => {
            const winner = disconnectedPlayerId === userUuid ? 'OPPONENT' : 'YOU';
            setGameOverModalState({ close: handleGameOver, winner, reason: 'forfeit' });
        });
        // clean up so we don't get duplicate events
        return () => ['move', 'verifyLastMove', 'playerDisconnected'].forEach(event => socket.removeListener(event));
    }, [inGame, lastMove]);

    useEffect(()=> {
        if (!receivedMove) return;
        moveFigure(receivedMove);
        setCurrentTurn(currentTurn === 'black' ? 'white' : 'black');
        setReceivedMove(null);
    }, [receivedMove]);

    // Rotate the board when props get updated
    useEffect(() => setPlayerIsBlack(playingAsBlack), [playingAsBlack]);

    useEffect(() => {
        if (!checkGameOver(gameBoard, currentTurn, whiteFigures, blackFigures)) return;
        const winnerColor = currentTurn === 'black' ? 'WHITE' : 'BLACK'; // We first change the turn then check if there are available moves
        const winner = (playerIsBlack && winnerColor === 'BLACK') || (!playerIsBlack && winnerColor === 'WHITE') ? 'YOU' : 'OPPONENT';
        setGameOverModalState({ close: handleGameOver, winner: isLocal ? winnerColor : winner, reason: 'checkmate' });
    }, [currentTurn]);

    function executeReceivedMove({ figIndex, nextSquareIndex, id }) {
        const figToMove = gameBoard[figIndex].occupiedBy;
        const enemyFigures = currentTurn === 'black' ? blackFigures : whiteFigures;
        setLastMove({ figIndex, nextSquareIndex, id });
        setSelectedFigure(figToMove);
        setAvailableMoves(figToMove.getFigureLegalMoves(gameBoard, enemyFigures));
        setReceivedMove(gameBoard[nextSquareIndex]);
    }

    function selectFigure(square) {
        const isMyTurn = isLocal || (playingAsBlack && currentTurn === 'black') || (!playingAsBlack && currentTurn === 'white');
        if (square.occupiedBy?.color !== currentTurn || !isMyTurn) return;

        const enemyFigures = currentTurn === 'black' ? whiteFigures : blackFigures;
        const legalMoves = square.occupiedBy.getFigureLegalMoves(gameBoard, enemyFigures);
        toggleSelectedStyles(square.occupiedBy, legalMoves);
        setSelectedFigure(square.occupiedBy);
        setAvailableMoves(legalMoves);
    }

    async function moveFigure(square) {
        if (!receivedMove) toggleSelectedStyles(selectedFigure, availableMoves);

        if (square.position !== selectedFigure.position && square.occupiedBy?.color === currentTurn) {
            selectFigure(square);
            return;
        }

        if (square.position === selectedFigure.position || !availableMoves.includes(square.position)) {
            setSelectedFigure(null);
            setAvailableMoves(null);
            return;
        }

        document.querySelector('.checked')?.classList.remove('checked');
        const gameBoardCopy = [...gameBoard];

        if (square.occupiedBy) takeFigure(square.occupiedBy);
        if (selectedFigure.type === 'king' && !selectedFigure.lastPosition) handleCastling(gameBoardCopy, square.position, currentTurn);

        gameBoardCopy[selectedFigure.position -1].occupiedBy = null;
        selectedFigure.lastPosition = selectedFigure.position;
        selectedFigure.position = square.position;
        gameBoardCopy[square.position -1].occupiedBy = selectedFigure;

        if (selectedFigure.canPromote()) await handlePawnPromotion(selectedFigure, currentTurn, setPromoModalState);

        const checkedPosition = selectedFigure.seeIfCheck(gameBoardCopy);
        if (checkedPosition !== -1) document.getElementById(checkedPosition).classList.add('checked');

        updateMovesHistory(square.name, selectedFigure.type);
        setSelectedFigure(null);
        setAvailableMoves(null);
        setGameBoard(gameBoardCopy);

        if (!receivedMove) switchTurn(selectedFigure.lastPosition - 1, square.position - 1);
    }

    function updateMovesHistory(squareName, figureType) {
        setMovesHistory(currentMoves => {
            const move = { squareName, figureType, player: currentTurn }
            return [...currentMoves, move];
        });
    }

    function takeFigure(figureToRemove) {
        const enemyFigures = currentTurn === 'white' ? setBlackFigures : setWhiteFigures;
        enemyFigures(figures => figures.filter(fig => fig !== figureToRemove));
    }

    function toggleSelectedStyles(figure, positions) {
        const toggleClass = (className, id) => document.getElementById(id).classList.toggle(className);
        toggleClass('selected', figure.position);
        positions.forEach(position => {
            toggleClass(`potential-move${ gameBoard[position -1].occupiedBy ? '-take' : '' }`, position);
        });
    }

    function switchTurn(figIndex, nextSquareIndex) {
        setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
        if (autoRotate) setPlayerIsBlack(!playerIsBlack);
        if (!isLocal) {
            socket.emit('move', { move: { figIndex, nextSquareIndex, id: lastMove.id + 1 }, roomId });
            setLastMove({ figIndex, nextSquareIndex, id: lastMove.id + 1 });
        }
    }

    return (
        <div className='Board'>
            <div className='wrapper' style={{ transform: playerIsBlack ? 'rotate(180deg)' : null }}>
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
            <div className='row-ranks'>{ rankElements(playerIsBlack).rowRanks }</div>
            <div className='col-ranks'>{ rankElements(playerIsBlack).colRanks }</div>
            { promoModalState ? promotionModal( promoModalState) : ''}
            { gameOverModalState ? gameOverModal(gameOverModalState) : '' }
        </div>
    )
}

export default Board;

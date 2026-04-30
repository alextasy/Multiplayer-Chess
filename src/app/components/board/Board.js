import React, { useContext, useEffect, useState } from 'react';
import './Board.scss';
import { useLocation } from 'react-router-dom';
import { initialSetUp, setFigures, rankElements, promotionModal, handleCastling, handlePawnPromotion, checkGameOver, gameOverModal, reconstructBoardFromState } from './boardHelper';
import { GameContext } from '../../context/GameContext';
import { socket } from '../../../helpers/Socket';
import { AppContext } from '../../context/AppContext';

function Board({ playingAsBlack, playable = true, autoRotate, handleGameOver }) {
    const [gameBoard, setGameBoard] = useState(initialSetUp());
    const [blackFigures, setBlackFigures] = useState(setFigures(gameBoard, 'black'));
    const [whiteFigures, setWhiteFigures] = useState(setFigures(gameBoard, 'white'));
    const [selectedFigure, setSelectedFigure] = useState(null);
    const [availableMoves, setAvailableMoves] = useState(null);

    const [currentTurn, setCurrentTurn] = useState('white');
    const [promoModalState, setPromoModalState] = useState(null);
    const [gameOverModalState, setGameOverModalState] = useState(null);

    const [playerIsBlack, setPlayerIsBlack] = useState(playingAsBlack);
    const location = useLocation();
    const [isLocal] = useState(location.pathname === '/local');
    const { roomId, setMovesHistory, inGame } = useContext(GameContext);
    const { userUuid } = useContext(AppContext);

    useEffect(() => setMovesHistory([]), []);

    useEffect(() => {
        if (!inGame || isLocal) return;
        socket.on('boardState', applyBoardState);
        socket.on('playerDisconnected', disconnectedPlayerId => {
            const winner = disconnectedPlayerId === userUuid ? 'OPPONENT' : 'YOU';
            setGameOverModalState({ close: handleGameOver, winner, reason: 'forfeit' });
        });
        return () => ['boardState', 'playerDisconnected'].forEach(event => socket.removeListener(event));
    }, [inGame]);

    // Only check game over locally for local play — multiplayer game over comes from the server
    useEffect(() => {
        if (!isLocal) return;
        if (!checkGameOver(gameBoard, currentTurn, whiteFigures, blackFigures)) return;
        const winnerColor = currentTurn === 'black' ? 'WHITE' : 'BLACK';
        setGameOverModalState({ close: handleGameOver, winner: winnerColor, reason: 'checkmate' });
    }, [currentTurn]);

    useEffect(() => setPlayerIsBlack(playingAsBlack), [playingAsBlack]);

    function applyBoardState({ board: boardData, currentTurn: newTurn, lastMove, checkedKingPosition, gameOver }) {
        const newBoard = reconstructBoardFromState(boardData);

        document.querySelector('.checked')?.classList.remove('checked');
        if (checkedKingPosition !== -1) {
            document.getElementById(checkedKingPosition)?.classList.add('checked');
        }

        setGameBoard(newBoard);
        setCurrentTurn(newTurn);
        setBlackFigures(setFigures(newBoard, 'black'));
        setWhiteFigures(setFigures(newBoard, 'white'));
        setSelectedFigure(null);
        setAvailableMoves(null);

        if (lastMove) {
            const movedPiece = boardData[lastMove.to].occupiedBy;
            updateMovesHistory(boardData[lastMove.to].name, movedPiece?.type, newTurn === 'white' ? 'black' : 'white');
            markLastMoveSquares(lastMove.from + 1, lastMove.to + 1);
        }

        if (gameOver) {
            const winner = (playerIsBlack && gameOver === 'black') || (!playerIsBlack && gameOver === 'white') ? 'YOU' : 'OPPONENT';
            setGameOverModalState({ close: handleGameOver, winner, reason: 'checkmate' });
        }
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

    async function moveFigure(square, promotedTo = undefined) {
        toggleSelectedStyles(selectedFigure, availableMoves);

        if (square.position !== selectedFigure.position && square.occupiedBy?.color === currentTurn) {
            selectFigure(square);
            return;
        }

        if (square.position === selectedFigure.position || !availableMoves.includes(square.position)) {
            setSelectedFigure(null);
            setAvailableMoves(null);
            return;
        }

        // Multiplayer: detect promotion, send move to backend, wait for boardState response
        if (!isLocal) {
            const needsPromotion = selectedFigure.type === 'pawn' &&
                ((selectedFigure.color === 'white' && square.position <= 8) ||
                 (selectedFigure.color === 'black' && square.position >= 57));
            if (needsPromotion) {
                promotedTo = await handlePawnPromotion({}, currentTurn, setPromoModalState);
            }
            socket.emit('move', {
                figIndex: selectedFigure.position - 1,
                nextSquareIndex: square.position - 1,
                promotedTo,
                roomId
            });
            // Optimistically flip turn to block double-move while waiting for server response
            setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
            setSelectedFigure(null);
            setAvailableMoves(null);
            return;
        }

        // Local play: apply the move immediately
        document.querySelector('.checked')?.classList.remove('checked');
        const gameBoardCopy = [...gameBoard];

        if (square.occupiedBy) takeFigure(square.occupiedBy);
        if (selectedFigure.type === 'king' && !selectedFigure.lastPosition) handleCastling(gameBoardCopy, square.position, currentTurn);

        gameBoardCopy[selectedFigure.position - 1].occupiedBy = null;
        selectedFigure.lastPosition = selectedFigure.position;
        selectedFigure.position = square.position;
        gameBoardCopy[square.position - 1].occupiedBy = selectedFigure;

        if (selectedFigure.canPromote()) {
            promotedTo = await handlePawnPromotion(selectedFigure, currentTurn, setPromoModalState, promotedTo);
        }

        const checkedPosition = selectedFigure.seeIfCheck(gameBoardCopy);
        if (checkedPosition !== -1) document.getElementById(checkedPosition).classList.add('checked');

        updateMovesHistory(square.name, selectedFigure.type);
        setSelectedFigure(null);
        setAvailableMoves(null);
        setGameBoard(gameBoardCopy);
        markLastMoveSquares(selectedFigure.lastPosition, square.position);
        switchTurn();
    }

    function updateMovesHistory(squareName, figureType, player = currentTurn) {
        setMovesHistory(currentMoves => [...currentMoves, { squareName, figureType, player }]);
    }

    function takeFigure(figureToRemove) {
        const enemyFigures = currentTurn === 'white' ? setBlackFigures : setWhiteFigures;
        enemyFigures(figures => figures.filter(fig => fig !== figureToRemove));
    }

    function toggleSelectedStyles(figure, positions) {
        const toggleClass = (className, id) => document.getElementById(id).classList.toggle(className);
        toggleClass('selected', figure.position);
        positions.forEach(position => {
            toggleClass(`potential-move${ gameBoard[position - 1].occupiedBy ? '-take' : '' }`, position);
        });
    }

    function switchTurn() {
        setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
        if (autoRotate) setPlayerIsBlack(!playerIsBlack);
    }

    function markLastMoveSquares(lastPositionSquareId, newPositionSquareId) {
        document.querySelectorAll('.square').forEach(el => el.classList.remove('last-selected', 'last-move'));
        document.getElementById(lastPositionSquareId).classList.add('last-selected');
        document.getElementById(newPositionSquareId).classList.add('last-move');
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
                            selectedFigure ? moveFigure(square) : selectFigure(square);
                        }}>
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
            { promoModalState ? promotionModal(promoModalState) : ''}
            { gameOverModalState ? gameOverModal(gameOverModalState) : '' }
        </div>
    )
}

export default Board;

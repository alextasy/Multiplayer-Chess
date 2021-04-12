import React, { useContext, useEffect, useState } from 'react';
import './Board.scss';
import { withRouter } from 'react-router-dom';
import { initialSetUp, setFigures, rankElements, promotionModal, imageSources, handleCastling } from './boardHelper';
import { GameContext } from '../../context/GameContext';
import { socket } from '../../../helpers/Socket';

function Board({ playingAsBlack, playable = true, location, autoRotate }) {
    const [gameBoard, setGameBoard] = useState(initialSetUp());
    const [blackFigures, setBlackFigures] = useState(setFigures('black'));
    const [whiteFigures, setWhiteFigures] = useState(setFigures('white'));
    const [selectedFigure, setSelectedFigure] = useState(null);
    const [availableMoves, setAvailableMoves] = useState (null);

    const [currentTurn, setCurrentTurn] = useState('white');
    const [checkedPlayer, setCheckedPlayer] = useState(null);
    const [promoModalState, setPromoModalState] = useState(null);

    const [playerIsBlack, setPlayerIsBlack] = useState(playingAsBlack);
    const [isLocal] = useState(location.pathname === '/local');
    const { roomId, setMovesHistory } = useContext(GameContext);
    const [receivedMove, setReceivedMove] = useState(null);

    useEffect(()=> {
        socket.on('move', ({ figIndex, nextSquareIndex }) => {
            const figToMove = gameBoard[figIndex].occupiedBy;
            const enemyFigures = currentTurn === 'black' ? blackFigures : whiteFigures;
            setSelectedFigure(figToMove);
            setAvailableMoves(figToMove.getFigureLegalMoves(gameBoard, enemyFigures));
            setReceivedMove(gameBoard[nextSquareIndex]);
        })
    }, []);

    useEffect(()=> {
        if (!receivedMove) return;
        moveFigure(receivedMove);
        setCurrentTurn(currentTurn === 'black' ? 'white' : 'black');
        setReceivedMove(null);
    }, [receivedMove]);

    // Rotate the board when props get updated
    useEffect(() => setPlayerIsBlack(playingAsBlack), [playingAsBlack]);

    useEffect(() => {
        if (!checkedPlayer) return;

        let hasLegalMoves = false;
        const enemyFigures = currentTurn === 'black' ? whiteFigures : blackFigures;
        const checkAllLegalMoves = figures => {
            figures.forEach(fig => {
                if (fig.getFigureLegalMoves(gameBoard, enemyFigures).length > 0) hasLegalMoves = true;
            });
        }
        currentTurn === 'black' ? checkAllLegalMoves(blackFigures) : checkAllLegalMoves(whiteFigures);
        if (!hasLegalMoves) console.log('GG');
        else setCheckedPlayer(false);
    }, [currentTurn]);

    function selectFigure(square) {
        const isMyTurn = isLocal || (playingAsBlack && currentTurn === 'black') || (!playingAsBlack && currentTurn === 'white');
        if (square.occupiedBy?.color !== currentTurn || !isMyTurn) return;
        const enemyFigures = currentTurn === 'black' ? whiteFigures : blackFigures;
        toggleSelectedStyles(square.occupiedBy);
        setSelectedFigure(square.occupiedBy);
        setAvailableMoves(square.occupiedBy.getFigureLegalMoves(gameBoard, enemyFigures));
    }

    async function moveFigure(square) {
        if (!receivedMove) toggleSelectedStyles(selectedFigure);

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
        if (selectedFigure.canPromote()) await handlePawnPromotion();
        const checkedKing = selectedFigure.seeIfCheck(gameBoardCopy, square.occupiedBy);
        if (checkedKing) {
            document.getElementById(checkedKing).classList.add('checked');
            setCheckedPlayer(true);
        }
        updateMovesHistory(square.name, selectedFigure.type);
        if (!receivedMove) switchTurn(square);
        setSelectedFigure(null);
        setAvailableMoves(null);
        setGameBoard(gameBoardCopy);
    }

    function updateMovesHistory(squareName, figureType) {
        setMovesHistory(currentMoves => {
            const move = {
                squareName: squareName,
                figureType: figureType,
                player: currentTurn
            }
            return [...currentMoves, move];
        });
    }

    function takeFigure(figureToRemove) {
        const enemyFigures = currentTurn === 'white' ? setBlackFigures : setWhiteFigures;
        enemyFigures(figures => figures.filter(fig => fig !== figureToRemove));
    }

    function handlePawnPromotion() {
        return new Promise(resolve => {
            const closeFunction = (type) => {
                selectedFigure.type = type;
                selectedFigure.img = {
                    src: imageSources[`${currentTurn}_${type}`],
                    alt: `${currentTurn} ${type}`
                };
                resolve();
                setPromoModalState(null);
            }
            setPromoModalState({ close: closeFunction, color: currentTurn });
        });
    }

    function toggleSelectedStyles(figure) {
        const enemyFigures = currentTurn === 'black' ? whiteFigures : blackFigures;
        const toggleClass = (className, id) => document.getElementById(id).classList.toggle(className);
        const positions = figure.getFigureLegalMoves(gameBoard, enemyFigures);
        toggleClass('selected', figure.position);
        positions.forEach(position => {
            if (gameBoard[position -1].occupiedBy) toggleClass('potential-move-take', position);
            else toggleClass('potential-move', position);
        });
    }

    function switchTurn(nextSquare) {
        setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
        if (autoRotate) setPlayerIsBlack(!playerIsBlack);
        if (isLocal) return;

        socket.emit('move', { figIndex: selectedFigure.lastPosition - 1, nextSquareIndex: nextSquare.position - 1, roomId });
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
        </div>
    )
}

export default withRouter(Board);

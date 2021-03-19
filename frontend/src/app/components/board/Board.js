import React, { useEffect, useRef, useState } from 'react';
import './Board.scss';
import { withRouter } from 'react-router-dom';
import { initialSetUp, setFigures, rowRanks, colRanks, promotionModal, imageSources } from './boardHelper';

function Board({ playerIsBlack, isMyTurn = true, playable = true, location }) {
    const [gameBoard, setGameBoard] = useState(initialSetUp());
    const [selectedFigure, setSelectedFigure] = useState(null);
    const [currentTurn, setCurrentTurn] = useState('white');
    const [availableMoves, setAvailableMoves] = useState (null);
    const isLocal = useRef(location.pathname === '/local');
    const [blackFigures, setBlackFigures] = useState(setFigures('black'));
    const [whiteFigures, setWhiteFigures] = useState(setFigures('white'));
    const [checkedPlayer, setCheckedPlayer] = useState(null);
    const [promoModalState, setPromoModalState] = useState(null);

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
        const enemyFigures = currentTurn === 'black' ? whiteFigures : blackFigures;
        if (square.occupiedBy?.color !== currentTurn || !isMyTurn) return;
        toggleSelectedStyles(square.occupiedBy);
        setSelectedFigure(square.occupiedBy);
        setAvailableMoves(square.occupiedBy.getFigureLegalMoves(gameBoard, enemyFigures));
    }

    async function moveFigure(square) {
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
        document.querySelector('.checked')?.classList.remove('checked');
        const gameBoardCopy = [...gameBoard];
        if (square.occupiedBy) takeFigure(square.occupiedBy);
        if (selectedFigure.type === 'king') handleCastling(gameBoardCopy, square.position);
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
        setSelectedFigure(null);
        setAvailableMoves(null);
        setGameBoard(gameBoardCopy);
        switchTurn();
    }

    function takeFigure(figureToRemove) {
        const enemyFigures = currentTurn === 'white' ? setBlackFigures : setWhiteFigures;
        enemyFigures(figures => figures.filter(fig => fig !== figureToRemove));
    }

    function handleCastling(board, kingNextPos) {
        const castlingPositions = currentTurn === 'black' ? [3, 7] : [59, 63];
        if (selectedFigure.lastPosition || !castlingPositions.includes(kingNextPos)) return;
        const queenSide = kingNextPos === castlingPositions[0];
        const currentRookSquare = queenSide ? board[kingNextPos - 3] : board[kingNextPos];
        const futureRookSquare = queenSide ? board[kingNextPos] : board[kingNextPos - 2];

        futureRookSquare.occupiedBy = currentRookSquare.occupiedBy;
        futureRookSquare.occupiedBy.position = futureRookSquare.position;
        currentRookSquare.occupiedBy = null;
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

    function switchTurn() {
        if (isLocal) {
            setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
            return;
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
            <div className='row-ranks'>{ rowRanks }</div>
            <div className='col-ranks'>{ colRanks }</div>
            { promoModalState ? promotionModal( promoModalState) : ''}
        </div>
    )
}

export default withRouter(Board);

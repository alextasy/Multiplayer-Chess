import React from 'react';
import Square from './board-elements/square';
import black_bishop from '../../../assets/figure-images/b-bishop.png';
import black_knight from '../../../assets/figure-images/b-knight.png';
import black_queen from '../../../assets/figure-images/b-queen.png';
import black_rook from '../../../assets/figure-images/b-rook.png';
import white_bishop from '../../../assets/figure-images/w-bishop.png';
import white_knight from '../../../assets/figure-images/w-knight.png';
import white_queen from '../../../assets/figure-images/w-queen.png';
import white_rook from '../../../assets/figure-images/w-rook.png';
import Modal, { closeModal } from '../modal/Modal';
import Button from '../button/Button';

export function initialSetUp() {
    const arr = [];
    let colorShouldInverse = false;

    for (let i = 1; i <= 64; i++) {
        const square = new Square(i, i % 2 === Number(colorShouldInverse) ? 'var(--primaryDark)' : 'var(--secondary)');
        arr.push(square);
        if (i % 8 === 0) colorShouldInverse = !colorShouldInverse;
    }
    return arr;
}

export function setFigures(board, color) {
    return board.filter(square => square.occupiedBy?.color === color).map(square => square.occupiedBy)
}

export const firstCol = [1, 9, 17, 25, 33, 41, 49, 57];
export const secondCol = [2, 10, 18, 26, 34, 42, 50, 58];
export const thirdCol = [3, 11, 19, 27, 35, 43, 51, 59];
export const fourthCol = [4, 12, 20, 28, 36, 44, 52, 60];
export const fifthCol = [5, 13, 21, 29, 37, 45, 53, 61];
export const sixthCol = [6, 14, 22, 30, 38, 46, 54, 62];
export const seventhCol = [7, 15, 23, 31, 39, 47, 55, 63];
export const eighthCol = [8, 16, 24, 32, 40, 48, 56, 64];

export const rankElements = (playerIsBlack) => {
    const remainder = playerIsBlack ? 0 : 1;
    const color = (i) => i % 2 === remainder ? 'var(--primary)' : 'var(--secondary)';
    const rowRanks = Array.from(Array(8)).map((_, i) => <span style={ {color: color(i) }} key={ i }>{ i + 1 }</span>);
    // Ascii table charCode 97 is equal to "a"
    const colRanks = Array.from(Array(8)).map((_, i) => <span style={ {color: color(i) }} key={ i }>{ String.fromCharCode(i + 97) }</span>);
    return {
        rowRanks: playerIsBlack ? rowRanks : rowRanks.reverse(),
        colRanks: playerIsBlack ? colRanks.reverse() : colRanks,
    }
}

const imageSources = { black_bishop, black_knight, black_queen, black_rook, white_bishop, white_knight, white_queen, white_rook };

export const promotionModal = ({ close, color }) => (
    <Modal>
        <h1>CHOOSE A CLASS FOR YOUR PAWN:</h1>
        <div className='promotion-container'>
            { ['rook', 'knight', 'queen', 'bishop'].map(type => (
                <div className='promotion-class' onClick={ _=> closeModal(close.bind(_, type)) } key={ type }>
                    <img src={ imageSources[`${color}_${type}`] } alt={ type }/>
                </div>
            ))}
        </div>
    </Modal>
);

export const handlePawnPromotion = (fig, color, setPromoModalState) => {
    return new Promise(resolve => {
        const close = type => {
            fig.type = type;
            fig.img = {
                src: imageSources[`${color}_${type}`],
                alt: `${color} ${type}`
            };
            resolve();
            setPromoModalState(null);
        }
        setPromoModalState({ close, color });
    });
}

export const handleCastling = (board, kingNextPos, currentTurn) => {
    const castlingPositions = currentTurn === 'black' ? [3, 7] : [59, 63];
    if (!castlingPositions.includes(kingNextPos)) return;
    const queenSide = kingNextPos === castlingPositions[0];
    const currentRookSquare = queenSide ? board[kingNextPos - 3] : board[kingNextPos];
    const futureRookSquare = queenSide ? board[kingNextPos] : board[kingNextPos - 2];

    futureRookSquare.occupiedBy = currentRookSquare.occupiedBy;
    futureRookSquare.occupiedBy.position = futureRookSquare.position;
    currentRookSquare.occupiedBy = null;
}

export const checkGameOver = (board, currentTurn, whiteFigures, blackFigures) => {
    const figures = currentTurn === 'black' ? blackFigures : whiteFigures;
    const enemyFigures = currentTurn === 'black' ? whiteFigures : blackFigures;
    for (const fig of figures) {
        if (fig.getFigureLegalMoves(board, enemyFigures).length) return false;
    };
    return true;
}

export const gameOverModal = ({ close, winner, reason }) => (
    <Modal>
        <div className='gameover-container'>
            <h1>GAME OVER</h1>
            <p>Winner by <span>{ reason }</span>: <b>{ winner }</b></p>
            <Button color='primary' click={ close }>OKAY</Button>
        </div>
    </Modal>
);

import React from 'react';
import Square from './board-elements/square';
import bBishop from '../../../assets/figure-images/b-bishop.png';
import bKnight from '../../../assets/figure-images/b-knight.png';
import bQueen from '../../../assets/figure-images/b-queen.png';
import bRook from '../../../assets/figure-images/b-rook.png';
import wBishop from '../../../assets/figure-images/w-bishop.png';
import wKnight from '../../../assets/figure-images/w-knight.png';
import wQueen from '../../../assets/figure-images/w-queen.png';
import wRook from '../../../assets/figure-images/w-rook.png';
import Modal, { closeModal } from '../modal/Modal';

let intialBoard;

export function initialSetUp() {
    const arr = [];
    let colorShouldInverse = false;

    for (let i = 1; i <= 64; i++) {
        const square = new Square(i, i % 2 === Number(colorShouldInverse) ? 'var(--primaryDark)' : 'var(--text)');
        arr.push(square);
        if (i % 8 === 0) colorShouldInverse = !colorShouldInverse;
    }
    intialBoard = arr;
    return arr;
}

export function setFigures(color) {
    return intialBoard.filter(square => square.occupiedBy?.color === color).map(square => square.occupiedBy)
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
    const color = (i) => i % 2 === remainder ? 'var(--primary)' : 'var(--text)';
    const rowRanks = Array.from(Array(8)).map((_, i) => <span style={ {color: color(i) }} key={ i }>{ i + 1 }</span>);
    // Ascii table charCode 97 is equal to "a"
    const colRanks = Array.from(Array(8)).map((_, i) => <span style={ {color: color(i) }} key={ i }>{ String.fromCharCode(i + 97) }</span>);
    return {
        rowRanks: playerIsBlack ? rowRanks.reverse() : rowRanks,
        colRanks: playerIsBlack ? colRanks.reverse() : colRanks,
    }
}

export const imageSources = {
    black_bishop: bBishop,
    black_knight: bKnight,
    black_queen: bQueen,
    black_rook: bRook,
    white_bishop: wBishop,
    white_knight: wKnight,
    white_queen: wQueen,
    white_rook: wRook,
}

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

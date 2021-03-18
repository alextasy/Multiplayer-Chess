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

const imageSources = {
    blackBishop: bBishop,
    blackKnight: bKnight,
    blackQueen: bQueen,
    blackRook: bRook,
    whiteBishop: wBishop,
    whiteKnight: wKnight,
    whiteQueen: wQueen,
    whiteRook: wRook,
}

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

export const rowRanks = Array.from(Array(8)).map((_, i) => {
   return <span style={{ color: i % 2 === 1 ? 'var(--primary)' : 'var(--text)' }} key={i}>{ i + 1 }</span>
});

export const colRanks = Array.from(Array(8)).map((_, i) => {
    return <span style={{ color: i % 2 === 1 ? 'var(--primary)' : 'var(--text)' }} key={i}>{ String.fromCharCode(i + 97) }</span>
});

export const promotionModal = (closeFunction, turn) => (
    <Modal>
        <h1>CHOOSE A CLASS FOR YOUR PAWN:</h1>
        <div className='promotion-container'>
            { ['Rook', 'Knight', 'Queen', 'Bishop'].map(type => (
                <div className='promotion-class' onClick={ (type)=> closeModal(closeFunction.bind(null, type)) }>
                    <img src={imageSources[`${turn}${type}`]} alt={type} key={type}/>
                </div>
            ))}
        </div>
    </Modal>
);

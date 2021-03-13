import Square from './board-elements/square';

let intialBoard;

export function initialSetUp() {
    const arr = [];
    let colorShouldInverse = false;

    for (let i = 1; i <= 64; i++) {
        const square = new Square(i, i % 2 === Number(colorShouldInverse) ? '#537133' : '#ebebeb');
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

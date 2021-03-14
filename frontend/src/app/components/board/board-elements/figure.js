import { firstCol, eighthCol, secondCol, seventhCol } from '../boardHelper';
export default class Figure {
    constructor (color, type, img, position) {
        this.color = color;
        this.type = type;
        this.img = img;
        this.position = position;
    }

    getFigureLegalMoves(gameBoard, enemyFigures) {
        let availablePositions = this.getDefaultMoves(gameBoard);
        availablePositions.forEach(potentialPositon => {
            const boardCopy = [...gameBoard].map(square => Object.create(square)); //Get a deep copy
            boardCopy[this.position - 1].occupiedBy = null;
            boardCopy[potentialPositon - 1].occupiedBy = this;
            enemyFigures.forEach(fig => {
                if (potentialPositon === fig.position) return; // Meaning we can take the attacking figure
                if (this.seeIfCheck(boardCopy, fig)) availablePositions = availablePositions.filter(position => position !== potentialPositon);
            });
        });
        return availablePositions;
    }

    seeIfCheck(board, figure) {
        const nextPositions = figure.getDefaultMoves(board);
        let check = false;
        nextPositions.forEach(position => {
            if (board[position - 1].occupiedBy?.type === 'king') check = true;
        });
        return check;
    }

    getDefaultMoves(board) {
        if (this.type === 'pawn') return this.getPawnMoves(board);
        if (this.type === 'knight') return this.getKnightMoves(board);
        if (this.type === 'rook') return [...this.getHorizontalMoves(board), ...this.getVerticalMoves(board)];
        if (this.type === 'bishop') return this.getDiagonalMoves(board);
        return [...this.getDiagonalMoves(board), ...this.getVerticalMoves(board), ...this.getHorizontalMoves(board)];
    }

    getVerticalMoves(board) {
        return [
            ...this.getAvailableSquares(board, 8),
            ...this.getAvailableSquares(board, -8),
        ];
    }

    getHorizontalMoves(board) {
        let rightMoves = this.getAvailableSquares(board, 1, true);
        let leftMoves = this.getAvailableSquares(board, -1, true);
        // If figure is on the border it shouldn't go in the direction of said border
        if (eighthCol.includes(this.position)) rightMoves = [];
        if (firstCol.includes(this.position) ) leftMoves = [];
        return [...rightMoves, ...leftMoves];
    }

    getDiagonalMoves(board) {
        const moves = [];
        if (!firstCol.includes(this.position)) {
            moves.push(...this.getAvailableSquares(board, -9, true));
            moves.push(...this.getAvailableSquares(board, 7, true));
        }
        if (!eighthCol.includes(this.position))  {
            moves.push(...this.getAvailableSquares(board, 9, true));
            moves.push(...this.getAvailableSquares(board, -7, true));
        }
        return moves;
    }

    getAvailableSquares(board, difference, goingSideways = false) {
        const moves = [];
        let nextPosition = this.position + difference;

        while (nextPosition < 65 && nextPosition > 0) {
            const squareIsFree = board[nextPosition - 1].occupiedBy === null;
            const enemyIsOnSquare = (board[nextPosition - 1].occupiedBy && board[nextPosition - 1].occupiedBy.color !== this.color);
            if (squareIsFree || enemyIsOnSquare) moves.push(nextPosition);
            else break;
            // King can move only one square and if there is an occupied squre we should not continue
            if (this.type === 'king' || enemyIsOnSquare) break;
            // Prevents from jumping to next row
            if (goingSideways && (firstCol.includes(nextPosition) || eighthCol.includes(nextPosition))) break;
            nextPosition += difference;
        }
        return moves;
    }

    getPawnMoves(board) {
        const moves = [];
        const isBlack = this.color === 'black';
        const nextPosFwd = this.position + (isBlack ? 8 : -8);
        const secondPosFwd = this.position + (isBlack ? 16 : -16);
        const nextPosLeft = this.position + (isBlack ? 9 : -9);
        const nextPosRight = this.position + (isBlack ? 7 : -7);
        const enemyIsOnLeftSquare = (board[nextPosLeft - 1]?.occupiedBy && board[nextPosLeft - 1].occupiedBy.color !== this.color);
        const enemyIsOnRightSquare = (board[nextPosRight - 1]?.occupiedBy && board[nextPosRight - 1].occupiedBy.color !== this.color);

        if (enemyIsOnLeftSquare) moves.push(nextPosLeft);
        if (enemyIsOnRightSquare) moves.push(nextPosRight);
        if (!board[nextPosFwd - 1].occupiedBy) moves.push(nextPosFwd);
        if (!this.hasMoved && !board[secondPosFwd - 1].occupiedBy) moves.push(secondPosFwd);

        return moves;
    }

    getKnightMoves(board) {
        const moves = [];
        const nextPositionDiff = [17, 15, 6, 10, -17, -15, -6, -10];

        nextPositionDiff.forEach(difference => {
            let shouldAdd = true;
            // Prevents from jumping to the other side of the board
            // If the figure is on the left border && it's not going right, the position shoudn't be added. Same for rest.
            if (firstCol.includes(this.position) && [15, 6, -10, -17].includes(difference)) shouldAdd = false;
            if (eighthCol.includes(this.position) && [-15, -6, 10, 17].includes(difference)) shouldAdd = false;
            if (secondCol.includes(this.position) && [6, -10].includes(difference)) shouldAdd = false;
            if (seventhCol.includes(this.position) && [-6, 10].includes(difference)) shouldAdd = false;

            const nextPosition = this.position + difference;
            const withinBoard = (nextPosition > 0 && nextPosition < 65);
            const notOccupiedByAlly = board[nextPosition -1]?.occupiedBy?.color !== this.color;
            if (withinBoard && notOccupiedByAlly && shouldAdd) moves.push(nextPosition);
        });
        return moves;
    }
}

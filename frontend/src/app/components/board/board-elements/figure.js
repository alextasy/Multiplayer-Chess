import { firstCol, eighthCol, secondCol, seventhCol } from '../boardHelper';
export default class Figure {
    constructor (color, type, img, position) {
        this.color = color;
        this.type = type;
        this.img = img;
        this.position = position;
    }

    getAvailableMoves(board) {
        switch (this.type) {
            case 'pawn': return this.getPawnMoves(board);
            case 'knight': return this.getKnightMoves(board);
            case 'rook': return [...this.getHorizontalMoves(board), ...this.getVerticalMoves(board)];
            case 'bishop': return this.invokeGetDiagonalMoves(board);
            default:
                return [
                    ...this.invokeGetDiagonalMoves(board),
                    ...this.getVerticalMoves(board),
                    ...this.getHorizontalMoves(board),
                ];
        }
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

    invokeGetDiagonalMoves(board) {
        return [
            ...this.getDiagonalMoves(board, 'top-left'),
            ...this.getDiagonalMoves(board, 'top-right'),
            ...this.getDiagonalMoves(board, 'bottom-left'),
            ...this.getDiagonalMoves(board, 'bottom-right'),
        ];
    }
    getDiagonalMoves(board, direction) {
        let differnce, returnCondition;

        switch (direction) {
            case 'top-left': {
                differnce = -9;
                returnCondition = firstCol.includes(this.position);
                break;
            }
            case 'top-right': {
                differnce = -7;
                returnCondition = eighthCol.includes(this.position);
                break;
            }
            case 'bottom-left': {
                differnce = 7;
                returnCondition = firstCol.includes(this.position);
                break;
            }
            case 'bottom-right': {
                differnce = 9;
                returnCondition = eighthCol.includes(this.position);
                break;
            }
            default: return;
        }
        // If figure is on the border it shouldn't go in the direction of said border
        if (returnCondition) return [];
        return this.getAvailableSquares(board, differnce, true);
    }

    getAvailableSquares(board, differnce, goingSideways = false) {
        const moves = [];
        let nextPosition = this.position + differnce;

        while (nextPosition < 65 && nextPosition > 0) {
            const squareIsFree = board[nextPosition - 1].occupiedBy === null;
            const enemyIsOnSquare = (board[nextPosition - 1].occupiedBy && board[nextPosition - 1].occupiedBy.color !== this.color);
            if (squareIsFree || enemyIsOnSquare) moves.push(nextPosition);
            else break;
            // King can move only one square and if there is an occupied squre we should not continue
            if (this.type === 'king' || enemyIsOnSquare) break;
            // Prevents from jumping to next row
            if (goingSideways && (firstCol.includes(nextPosition) || eighthCol.includes(nextPosition))) break;
            nextPosition += differnce;
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
        const hasNotMoved = isBlack ? [9, 10, 11, 12, 13, 14 , 15, 16].includes(this.position)
                                 : [49, 50, 51, 52, 53, 54 , 55, 56].includes(this.position);

        if (enemyIsOnLeftSquare && !this.hasMoved) moves.push(nextPosLeft);
        if (enemyIsOnRightSquare && !this.hasMoved) moves.push(nextPosRight);
        if (!board[nextPosFwd - 1].occupiedBy) moves.push(nextPosFwd);
        if (hasNotMoved && !board[secondPosFwd - 1].occupiedBy) moves.push(secondPosFwd);


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
            const notOccupiedByAlly = withinBoard ? board[nextPosition -1].occupiedBy?.color !== this.color : false;
            if (withinBoard && notOccupiedByAlly && shouldAdd) moves.push(nextPosition);
        });
        return moves;
    }

}

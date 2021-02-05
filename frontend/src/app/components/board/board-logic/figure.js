export default class Figure {
    constructor (color, type, img, position) {
        this.color = color;
        this.type = type;
        this.img = img;
        this.hasMoved = false;
        this.position = position;
    }
    leftBorder = [1, 9, 17, 25, 33, 41, 49, 57];
    rightBorder = [8, 16, 24, 32, 40, 48, 56, 64];

    getAvailableMoves(board) {
        switch (this.type) {
            case 'rook': return [...this.getHorizontalMoves(board), ...this.getVerticalMoves(board)];
            case 'bishop': return [...this.getDiagonalMoves];
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

    //Function will play twice and for each direction, by calling itself
    getHorizontalMoves(board, leftMoves = false, moves = []) {
        const difference = leftMoves ? - 1 : 1;
        // If figure is on the border it shouldn't go in the direction of said border
        if (this.rightBorder.includes(this.position) && !leftMoves) return moves;
        if (this.leftBorder.includes(this.position) && leftMoves) return moves;

        moves = [...moves, ...this.getAvailableSquares(board, difference, true)];
        if (leftMoves) return moves;
        return this.getHorizontalMoves(board, true, moves);
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
                returnCondition = this.leftBorder.includes(this.position);
                break;
            }
            case 'top-right': {
                differnce = -7;
                this.rightBorder.includes(this.position);
                break;
            }
            case 'bottom-left': {
                differnce = 7;
                returnCondition = this.leftBorder.includes(this.position);
                break;
            }
            case 'bottom-right': {
                differnce = 9;
                this.rightBorder.includes(this.position);
                break;
            }
            default: throw new Error ('No such direction');
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
            if (goingSideways && (this.leftBorder.includes(nextPosition) || this.rightBorder.includes(nextPosition))) break;
            nextPosition += differnce;
        }
        return moves;
    }

}

import bPawn from '../../../../assets/figure-images/b-pawn.png';
import bBishop from '../../../../assets/figure-images/b-bishop.png';
import bKnight from '../../../../assets/figure-images/b-knight.png';
import bKing from '../../../../assets/figure-images/b-king.png';
import bQueen from '../../../../assets/figure-images/b-queen.png';
import bRook from '../../../../assets/figure-images/b-rook.png';
import wPawn from '../../../../assets/figure-images/w-pawn.png';
import wBishop from '../../../../assets/figure-images/w-bishop.png';
import wKnight from '../../../../assets/figure-images/w-knight.png';
import wKing from '../../../../assets/figure-images/w-king.png';
import wQueen from '../../../../assets/figure-images/w-queen.png';
import wRook from '../../../../assets/figure-images/w-rook.png';
import Figure from './figure';

export default class Square {
    constructor(position, color) {
        this.position = position;
        this.color = color;
        this.isOccupiedBy = null;
        this.intialSetUp(position);
    }

    intialSetUp(p) {
        if (p > 8 && p <= 16) this.occupiedBy = new Figure('black', 'pawn', { src: bPawn, alt: 'Black pawn' }, p);
        if (p > 48 && p <= 56) this.occupiedBy = new Figure('white', 'pawn', { src: wPawn, alt: 'White pawn' }, p);

        if (p === 1 || p === 8) this.occupiedBy = new Figure('black', 'rook', { src: bRook, alt: 'Black rook' }, p);
        if (p === 2 || p === 7) this.occupiedBy = new Figure('black', 'knight', { src: bKnight, alt: 'Black knight' }, p);
        if (p === 3 || p === 6) this.occupiedBy = new Figure('black', 'bishop', { src: bBishop, alt: 'Black bishop' }, p);
        if (p === 4) this.occupiedBy = new Figure('black', 'queen', { src: bQueen, alt: 'Black queen' }, p);
        if (p === 5) this.occupiedBy = new Figure('black', 'king', { src: bKing, alt: 'Black king' }, p);

        if (p === 57 || p === 64) this.occupiedBy = new Figure('white', 'rook', { src: wRook, alt: 'White rook' }, p);
        if (p === 58 || p === 63) this.occupiedBy = new Figure('white', 'knight', { src: wKnight, alt: 'White knight' }, p);
        if (p === 59 || p === 62) this.occupiedBy = new Figure('white', 'bishop', { src: wBishop, alt: 'White bishop' }, p);
        if (p === 60) this.occupiedBy = new Figure('white', 'queen', { src: wQueen, alt: 'White queen' }, p);
        if (p === 61) this.occupiedBy = new Figure('white', 'king', { src: wKing, alt: 'White king' }, p);
    }
}

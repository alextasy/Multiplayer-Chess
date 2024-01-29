import React, { useContext } from 'react';
import './MovesHistory.scss';
import bishop from '../../../assets/figure-images/g-bishop.png';
import king from '../../../assets/figure-images/g-king.png';
import queen from '../../../assets/figure-images/g-queen.png';
import knight from '../../../assets/figure-images/g-knight.png';
import pawn from '../../../assets/figure-images/g-pawn.png';
import rook from '../../../assets/figure-images/g-rook.png';
import { GameContext } from '../../context/GameContext';

const imgSrc = { bishop, king, queen, knight, rook, pawn };

function MovesHistory() {
    const gameContext = useContext(GameContext);
    const movesArr = gameContext.movesHistory;

    const moves = (() => {
        if (!movesArr.length) return;
        const whiteMoves = movesArr.filter(move => move.player === 'white');
        const blackMoves = movesArr.filter(move => move.player === 'black');
        return whiteMoves.map((move, i) => {
            const wType = move.figureType;
            const bType = blackMoves[i]?.figureType;
            return <div key={ i }>
                    <span>{ i + 1 }: </span>
                    <span className='white'><img src={ imgSrc[wType] } alt={ wType }/> { move.squareName }</span>
                    <span className='black'>{ bType ? <><img src={ imgSrc[bType] } alt={ bType }/> { blackMoves[i].squareName }</> : '' }</span>
                </div>
        }).reverse();
    })();

    return (
        <div className='MovesHistory'>
            <h3>MOVES HISTORY ...</h3>
            <div className='labels'>
                <span>№</span>
                <span>White</span>
                <span>Black</span>
            </div>
            <section>{ moves }</section>
        </div>
    )
}

export default MovesHistory;

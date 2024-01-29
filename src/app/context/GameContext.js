import React, { useState } from 'react'

export const GameContext = React.createContext({
    movesHistory: [],
    setMovesHistory: () => {},
    roomId: '',
    setRoomId: () => {},
    inGame: false,
    setInGame: () => {},
})

const GameContextProvider = (props)=>{
    const [moves, setMoves] = useState([]);
    const [room, setRoom] =useState('');
    const [game, setGame] =useState(false);

    return(
        <GameContext.Provider value={{
            movesHistory: moves, setMovesHistory: setMoves,
            roomId: room, setRoomId: setRoom,
            inGame: game, setInGame: setGame,
         }}>
            {props.children}
        </GameContext.Provider>
    );
}

export default GameContextProvider;

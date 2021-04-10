import React, { useState } from 'react'

export const GameContext = React.createContext({
    movesHistory: [],
    setMovesHistory: () => {},
    roomId: '',
    setRoomId: () => {},
})

const GameContextProvider = (props)=>{
    const [moves, setMoves] = useState([]);
    const [room, setRoom] =useState('');
    return(
        <GameContext.Provider value={{
            movesHistory: moves, setMovesHistory: setMoves,
            roomId: room, setRoomId: setRoom,
         }}>
            {props.children}
        </GameContext.Provider>
    );
}

export default GameContextProvider;

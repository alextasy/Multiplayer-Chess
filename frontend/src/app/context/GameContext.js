import React, { useState } from 'react'

export const GameContext = React.createContext({
    movesHistory: [],
    setMovesHistory: () => {},
})

const GameContextProvider = (props)=>{
    const [moves, setMoves] = useState([]);

    return(
        <GameContext.Provider value={{
            movesHistory: moves, setMovesHistory: setMoves
         }}>
            {props.children}
        </GameContext.Provider>
    );
}

export default GameContextProvider;

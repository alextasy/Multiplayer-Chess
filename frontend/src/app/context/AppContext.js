import React, { useState } from 'react';

export const AppContext = React.createContext({
    isSigningIn: false,
    setIsSigningIn: () => {},
    isSigningUp: false,
    setIsSigningUp: () => {},
});

const AppContextProvider = (props)=>{
    const [signingIn, setSingingIn] = useState(false);
    const [signingUp, setSigningUp] = useState(false);
    return(
        <AppContext.Provider value={{
            isSigningIn: signingIn, setIsSigningIn: setSingingIn,
            isSigningUp: signingUp, setIsSigningUp: setSigningUp,
         }}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;

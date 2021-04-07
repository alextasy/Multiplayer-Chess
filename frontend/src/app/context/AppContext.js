import React, { useState } from 'react';

export const AppContext = React.createContext({
    isSigningIn: false,
    setIsSigningIn: () => {},
    isSigningUp: false,
    setIsSigningUp: () => {},
    isAuth: false,
    setIsAuth: () => {},
    user: {},
    setUser: () => {},
});

const AppContextProvider = (props)=>{
    const [signingIn, setSingingIn] = useState(false);
    const [signingUp, setSigningUp] = useState(false);
    const [auth, setAuth] = useState(false);
    const [userState, setUserState] = useState('');
    return(
        <AppContext.Provider value={{
            isSigningIn: signingIn, setIsSigningIn: setSingingIn,
            isSigningUp: signingUp, setIsSigningUp: setSigningUp,
            isAuth: auth, setIsAuth: setAuth,
            user: userState, setUser: setUserState,
         }}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;

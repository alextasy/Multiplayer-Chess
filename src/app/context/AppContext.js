import React, { useState } from 'react';

export const AppContext = React.createContext({
    isChangingName: false,
    setIsChangingName: () => {},
    userDisplayName: '',
    setUserDisplayName: () => {},
});

const AppContextProvider = (props)=>{
    const [isChangingNameState, setIsChangingNameState] = useState(false);
    const [userDisplayNameState, setUserDisplayNameState] = useState('');
    return(
        <AppContext.Provider value={{
            isChangingName: isChangingNameState, setIsChangingName: setIsChangingNameState,
            userDisplayName: userDisplayNameState, setUserDisplayName: setUserDisplayNameState,
         }}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;

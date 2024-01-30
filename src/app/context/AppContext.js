import React, { useState } from 'react';

export const AppContext = React.createContext({
    isChangingName: false,
    setIsChangingName: () => {},
    userDisplayName: '',
    setUserDisplayName: () => {},
    userUuid: '',
    setUserUuid: () => {},
});

const AppContextProvider = (props)=>{
    const [isChangingNameState, setIsChangingNameState] = useState(false);
    const [userDisplayNameState, setUserDisplayNameState] = useState('');
    const [uuid, setUuid] = useState('');

    return(
        <AppContext.Provider value={{
            isChangingName: isChangingNameState, setIsChangingName: setIsChangingNameState,
            userDisplayName: userDisplayNameState, setUserDisplayName: setUserDisplayNameState,
            userUuid: uuid, setUserUuid: setUuid,
         }}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;

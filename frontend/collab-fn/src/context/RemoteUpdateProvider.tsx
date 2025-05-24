import React, {createContext, useContext, useRef, ReactNode, RefObject} from 'react';

const RemoteUpdateContext = createContext<RefObject<boolean> | undefined>(undefined);

export const RemoteUpdateProvider = ({children}:{children : ReactNode}) =>{
    const remoteUpdateRef = useRef<boolean>(false);

    return (
        <RemoteUpdateContext.Provider value={remoteUpdateRef}>
            {children}
        </RemoteUpdateContext.Provider>
    )
}

export const useRemoteUpdate = () => {
    const context = useContext(RemoteUpdateContext);

    if (!context) {
    throw new Error('useRemoteUpdate must be used within a RemoteUpdateProvider');
  }
  return context;
}
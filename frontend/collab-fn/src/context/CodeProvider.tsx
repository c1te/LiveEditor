import React, {createContext, useContext, useState, ReactNode} from 'react';

interface CodeContextType {
    code: string,
    setCode: React.Dispatch<React.SetStateAction<string>>;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider = ({children}: {children:ReactNode}) =>{
    const [code, setCode] = useState<string>("");

    return(
        <CodeContext.Provider value={{code, setCode}}>
            {children}
        </CodeContext.Provider>
    );
}

export const useCode = () => {
    const context = useContext(CodeContext);
    if (!context) {
        throw new Error('useCode must be used within a CodeProvider');
    }
    return context;
}


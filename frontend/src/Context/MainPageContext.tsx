import React, { createContext, useState, ReactNode } from 'react';

interface MainPageContextType {
    ShowComponent:string;
    setShowComponent:React.Dispatch<React.SetStateAction<string>>;
}

export const MainPageContext = createContext<MainPageContextType>({
    ShowComponent:'Dashboard',
    setShowComponent:()=>{}
});

interface MainPageContextproviderProps {
    children:ReactNode;
}

const MainPageContextProvider = ({children}:MainPageContextproviderProps) => {
    const [ShowComponent,setShowComponent]=useState('Dashboard');
    

const contextValue:MainPageContextType= {
setShowComponent,
ShowComponent,
}
  return (
   <MainPageContext.Provider value={contextValue}>
    {children}
   </MainPageContext.Provider>
  )
}

export default MainPageContextProvider
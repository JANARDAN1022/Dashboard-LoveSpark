import React, { createContext, useState, ReactNode } from 'react';

interface MainPageContextType {
    ShowComponent:string;
    LogoutLoading:boolean;
    setLogoutLoading:React.Dispatch<React.SetStateAction<boolean>>;
    setShowComponent:React.Dispatch<React.SetStateAction<string>>;
}

export const MainPageContext = createContext<MainPageContextType>({
    ShowComponent:'Dashboard',
    LogoutLoading:false,
    setLogoutLoading:()=>{},
    setShowComponent:()=>{}
});

interface MainPageContextproviderProps {
    children:ReactNode;
}

const MainPageContextProvider = ({children}:MainPageContextproviderProps) => {
    const [ShowComponent,setShowComponent]=useState('Dashboard');
    const [LogoutLoading,setLogoutLoading]=useState(false);
    

const contextValue:MainPageContextType= {
setShowComponent,
setLogoutLoading,
LogoutLoading,
ShowComponent,
}
  return (
   <MainPageContext.Provider value={contextValue}>
    {children}
   </MainPageContext.Provider>
  )
}

export default MainPageContextProvider
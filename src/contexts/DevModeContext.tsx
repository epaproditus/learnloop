import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DevModeContextType {
  isDevMode: boolean;
  setIsDevMode: (value: boolean) => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export const DevModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDevMode, setIsDevMode] = useState(false);

  return (
    <DevModeContext.Provider value={{ isDevMode, setIsDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
};

export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (context === undefined) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
};

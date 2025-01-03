import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface DevModeContextType {
  isDevMode: boolean;
  setIsDevMode: (value: boolean) => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

interface DevModeProviderProps {
  children: ReactNode;
}

export function DevModeProvider({ children }: DevModeProviderProps) {
  const [isDevMode, setIsDevMode] = useState(() => {
    const saved = localStorage.getItem('devMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('devMode', JSON.stringify(isDevMode));
  }, [isDevMode]);

  return (
    <DevModeContext.Provider value={{ isDevMode, setIsDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const context = useContext(DevModeContext);
  if (context === undefined) {
    throw new Error("useDevMode must be used within a DevModeProvider");
  }
  return context;
}

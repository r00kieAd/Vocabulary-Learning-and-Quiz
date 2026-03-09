import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface GlobalState {
    activeTheme: string;
    setActiveTheme: (value: string) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
    const [activeTheme, setActiveTheme] = useState<string>('');

    return <GlobalContext.Provider value={{ 
        activeTheme, setActiveTheme
    }}>
        {children}
    </GlobalContext.Provider>
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("useGlobal must be used inside GlobalProvider");
    return context;
}
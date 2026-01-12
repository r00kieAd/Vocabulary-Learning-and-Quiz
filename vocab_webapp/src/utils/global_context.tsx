import { createContext } from "react";
import type { ReactNode } from "react";
import { useContext, useState } from "react"

interface GlobalState {
    serverConnected: boolean;
    setServerConnected: (value: boolean) => void;
    serverConnectFailed: boolean;
    setServerConnectFailed: (value: boolean) => void;
    loaderActive: boolean;
    setLoaderActive: (value: boolean) => void;
};

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
    const [loaderActive, setLoaderActive] = useState(true);
    const [serverConnected, setServerConnected] = useState(false);
    const [serverConnectFailed, setServerConnectFailed] = useState(false);
    return <GlobalContext.Provider value={{
        loaderActive, setLoaderActive,
        serverConnected, setServerConnected,
        serverConnectFailed, setServerConnectFailed
    }}>
      {children}
    </GlobalContext.Provider>
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("useGlobal must be used inside GlobalProvider");
    return context;
}


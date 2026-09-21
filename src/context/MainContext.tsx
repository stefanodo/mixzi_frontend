import { createContext, useContext } from "react";
import MainStore from "../stores/MainStore";

const mainStore = new MainStore();
mainStore.init();

// eslint-disable-next-line react-refresh/only-export-components
export const MainStoreContext = createContext(mainStore);

export function MainStoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <MainStoreContext.Provider value={mainStore}>
            {children}
        </MainStoreContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMainStore = () => {
    const store = useContext(MainStoreContext);
    if (store === null) {
        throw new Error("Store cannot be null, please add a context provider");
    }
    return store;
};

export const MainStoreInstance = mainStore;
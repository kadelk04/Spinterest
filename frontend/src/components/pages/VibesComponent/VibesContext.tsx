import { 
    createContext, 
    useContext, 
    useState, 
    ReactNode } from 'react';

interface VibesContextType {
    isOpen: boolean;
    openVibes: () => void;
    closeVibes: () => void;
}

const VibesContext = createContext<VibesContextType | null>(null);

export const useVibes = (): VibesContextType => {
    const vibesContext = useContext(VibesContext);
    if (!vibesContext) {
        throw new Error(
          "vibesContext has to be used within Vibes Provider"  
        );
    }
    return vibesContext;
};

export const VibesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const openVibes = () => setIsOpen(true);
    const closeVibes = () => setIsOpen(false);

    return (
        <VibesContext.Provider value={{ isOpen, openVibes, closeVibes }}>
        {children}
      </VibesContext.Provider>
    );
};

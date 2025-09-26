import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';



type SourceContextType = {
    currentSource: string;
    setCurrentSource: (name: string) => void;
};

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export function SourceProvider({ children }: { children: ReactNode }) {
    // const [source] = useState<Source[]>([
    //     { id: 1, name: 'wallhaven' },
    //     { id: 2, name: 'konachan' },
    //     { id: 3, name: 'anime-pictures' },
    // ]);
    const [currentSource, setCurrentSource] = useState('wallhaven');

    return (
        <SourceContext.Provider 
            value={{ 
                // source,
                currentSource,
                setCurrentSource
            }}
        >
            {children}
        </SourceContext.Provider>
    );
}

export function useSource() {
    const context = useContext(SourceContext);
    if (context === undefined) {
        throw new Error('useSource must be used within a SourceProvider');
    }
    return context;
}
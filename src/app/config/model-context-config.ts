'use client';
import { createContext } from 'react';

export const defaultModelInfo = {
    provider: 'AZURE',
    variant: 'GENERAL',
    description: 'GPT-3.5 - A faster and cheaper yet still very capable model',
    location: 'UK',
};

export interface ModelContextType {
    modelInfo: {
        provider: string;
        variant: string;
        description: string;
        location: string;
    };
    setModelContext: React.Dispatch<
        React.SetStateAction<{ provider: string; variant: string; description: string; location: string }>
    >;
}

export const modelContext = createContext<ModelContextType>({
    modelInfo: { ...defaultModelInfo },
    setModelContext: () => {},
});

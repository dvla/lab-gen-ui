'use client';
import { createContext } from 'react';

export enum ModelFamily{
    GPT = "GPT",
    CLAUDE = "CLAUDE",
    GEMINI = "GEMINI",
    MISTRAL = "MISTRAL",
    UNSPECIFIED = "UNSPECIFIED"
}

export const defaultModelInfo = {
    provider: 'AZURE',
    variant: 'GENERAL',
    family: ModelFamily.GPT,
    description: 'GPT-3.5 - A faster and cheaper yet still very capable model',
    location: 'UK',
};

export interface ModelContextType {
    modelInfo: {
        provider: string;
        variant: string;
        family: ModelFamily;
        description: string;
        location: string;
    };
    setModelContext: React.Dispatch<
        React.SetStateAction<{ provider: string; variant: string; family: ModelFamily; description: string; location: string }>
    >;
}

export const modelContext = createContext<ModelContextType>({
    modelInfo: { ...defaultModelInfo },
    setModelContext: () => {},
});

'use client';
import { createContext } from 'react';
import { Model } from '@/app/lib/fetchers';

export enum ModelFamily {
    GPT = 'GPT',
    CLAUDE = 'CLAUDE',
    GEMINI = 'GEMINI',
    MISTRAL = 'MISTRAL',
    UNSPECIFIED = 'UNSPECIFIED',
}

export const defaultModelInfo = {
    provider: 'AZURE',
    variant: 'GENERAL',
    family: ModelFamily.GPT,
    description: 'GPT-3.5 - A faster and cheaper yet still very capable model',
    location: 'UK',
    key: 'AZUREGPTGENERAL',
};

export interface ModelContextType {
    modelInfo: Model;
    setModelContext: React.Dispatch<React.SetStateAction<Model>>;
}

export const modelContext = createContext<ModelContextType>({
    modelInfo: { ...defaultModelInfo },
    setModelContext: () => {},
});

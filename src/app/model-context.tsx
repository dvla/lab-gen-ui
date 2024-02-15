'use client';
import React, { useState, useEffect } from 'react';
import { defaultModelInfo, modelContext } from './config/model-context-config';

/**
 * Context provider for the model, which stores and retrieves model info from session storage.
 *
 * @param {{ children: React.ReactNode }} children - The child components to be wrapped by the provider
 * @return {ReactNode} The wrapped child components with model context
 */
const ModelContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [modelInfo, setModelContext] = useState(defaultModelInfo);
    const [loadedModelFromSession, setLoadedModelFromSession] = useState(false);

    useEffect(() => {
        const savedState = sessionStorage.getItem('modelContext');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            setModelContext(parsedState);
        }
        setLoadedModelFromSession(true);
        
    }, []);

    useEffect(() => {
        if (loadedModelFromSession) {
            sessionStorage.setItem('modelContext', JSON.stringify(modelInfo));
        }
    }, [modelInfo, loadedModelFromSession]);

    return (
        <modelContext.Provider value={{ modelInfo, setModelContext }}>
            {children}
        </modelContext.Provider>
    );
};

export default ModelContextProvider;

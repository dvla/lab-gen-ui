import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';

/**
 * The props for the Mermaid component.
 */
interface MermaidProps {
    chart: string;
    onError: (error: any) => void;
}

/**
 * Renders Mermaid charts inside a React component, handling
 * errors and references to the chart element.
 *
 * @param {MermaidProps} { chart, onError } - Object with the
 * chart string and an error handler function.
 * @return {JSX.Element} A React element representing the
 * Mermaid chart or an error state.
 */
const Mermaid = ({ chart, onError }: MermaidProps) => {
    const mermaidRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState(null);

    //Initializes mermaid when component first mounts
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'monospace',
        });
    }, []);

    /**
     * Asynchronously renders a Mermaid diagram and manages errors.
     */
    const renderMermaid = async () => {
        if (mermaidRef.current) {
            mermaidRef.current.removeAttribute('data-processed');
            try {
                await mermaid.run({ nodes: [mermaidRef.current] });
                setError(null);
            } catch (error: any) {
                if (error.hash === 'UnknownDiagramError') {
                    setError(error);
                    onError(error);
                }
            }
        }
    };

    //Renders Mermaid chart
    useEffect(() => {
        renderMermaid();
    }, [chart]);

    return error ? (
        <div className="mermaid" style={{ display: 'none' }} ref={mermaidRef}>
            {chart}
        </div>
    ) : (
        <div className="mermaid" ref={mermaidRef}>
            {chart}
        </div>
    );
};

export default Mermaid;

import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';

/**
 * The props for the Mermaid component.
 */
interface MermaidProps {
    chart: string;
    onError: (error: string) => void;
}

const DIAGRAM_ERROR_MESSAGE =
        'Error loading diagram: Please reset and try amending your specifications or using a different model.';

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
    let [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(false);
        setError(null);
        onError('');
        if (mermaidRef.current) {
            mermaidRef.current.removeAttribute('data-processed');
            try {
                await mermaid.run({ nodes: [mermaidRef.current] });
                setIsLoading(true);
            } catch (error: any) {
                if(error.hash !== "TypeError") {
                    setError(error);
                    onError(DIAGRAM_ERROR_MESSAGE);
                }
            }
        }
    };

    //Renders Mermaid chart
    useEffect(() => {
        renderMermaid();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chart]);

    //Scrolls to the diagram when it loads
    useEffect(() => {
        mermaidRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [isLoading]);

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

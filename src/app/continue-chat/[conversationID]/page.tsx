'use client';
import FixedPage from '@/app/components/fixed-page';
import { Spinner } from 'govuk-react';
import { useContext, useEffect, useState } from 'react';
import { Variable } from '@/app/components/generator/generator';
import GeneratorTabs from '@/app/components/generator/generator-tabs';
import { modelContext } from '@/app/config/model-context-config';

/**
 * Generate the ContinueChat component.
 *
 * @param {any} params - object containing parameters
 * @return {JSX.Element} the ContinueChat component
 */
const ContinueChat = ({ params }: any) => {
    const promptType = 'text';
    const variables: Variable[] = [];
    const { modelInfo } = useContext(modelContext);
    const [showResult, setShowResult] = useState(false);

    /**
     * Reset the window location to '/prompt-templates'.
     *
     * @return {void}
     */
    const reset = () => {
        window.location.href = '/prompt-templates';
    };

    useEffect(() => {
        setShowResult(true);
    }, []);

    return (
        <FixedPage backButton={true} modelBanner={true}>
            <main>
                <div className="govuk-grid-column-full">
                    <div className="govuk-grid-row">
                        {!showResult && <Spinner fill="#b1b4b6" height="56px" width="56px" />}
                        {showResult && (
                            <GeneratorTabs
                                model={modelInfo}
                                variables={variables}
                                promptType={promptType}
                                reset={reset}
                                streamingEnabled={true}
                                conversationId={params.conversationID}
                            />
                        )}
                    </div>
                </div>
            </main>
        </FixedPage>
    );
};

export default ContinueChat;

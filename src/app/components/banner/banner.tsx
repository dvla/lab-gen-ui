'use client';
import { modelContext } from '@/app/config/model-context-config';
import { useContext } from 'react';

/**
 * ModelBanner component to generate a model banner based on the selected model.
 *
 * @return {JSX.Element} The prompt template component
 */
const ModelBanner = () => {
    const { modelInfo } = useContext(modelContext);

    const isGeneralModel = modelInfo.variant === 'GENERAL';
    const isUKLocation = modelInfo.location === 'UK';

    // Display a warning banner if the selected model is not UK or General
    if (!isGeneralModel || !isUKLocation) {
        const costMessage = isGeneralModel ? '' : <b> incurs higher costs</b>;
        const locationMessage = isUKLocation ? (
            ''
        ) : (
            <span>
                {' '}
                is hosted <b>in {modelInfo.location}</b>
            </span>
        );
        const connector = !isGeneralModel && !isUKLocation ? ' and' : '';

        return (
            <div className="govuk-phase-banner">
                <p
                    className="govuk-phase-banner__content"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <strong
                            className="govuk-tag govuk-tag--red govuk-phase-banner__content__tag"
                            title={modelInfo.description}
                        >
                            {modelInfo.family + ' ' + modelInfo.variant + ' ' + modelInfo.provider}
                        </strong>
                        <span className="govuk-phase-banner__text">
                            The selected model{costMessage}
                            {connector}
                            {locationMessage}.
                        </span>
                    </span>
                    <a className="govuk-link" href="/model-info" target="_blank">
                        Learn more
                    </a>
                </p>
            </div>
        );
    } else {
        return null;
    }
};

export default ModelBanner;

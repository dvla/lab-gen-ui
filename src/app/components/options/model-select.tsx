import { ChangeEvent, useContext, useEffect } from 'react';
import { capitalCase } from '@/app/lib/utils';
import useSWR from 'swr';
import { modelContext } from '@/app/config/model-context-config';

const fetcher = (url: string) =>
    fetch(url).then(async (res) => {
        if (!res.ok) {
            const response = await res.json();
            const error = new Error(response.error);
            throw error;
        }
        return await res.json();
    });

const SWR_OPTIONS = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 5,
};

interface ModelSelectProps {
    variantLock?: string;
}

/**
/**
 * A component that renders a select box for choosing a model.
 * It tracks the current model context, and handles selection changes
 * to update the model context.
 */
const ModelSelect = ({ variantLock }: ModelSelectProps) => {
    const {
        data: models,
        error: modelsError,
        isLoading: modelsLoading,
    } = useSWR('/api/get-models', fetcher, SWR_OPTIONS);
    const { modelInfo, setModelContext } = useContext(modelContext);

    /**
     * Handles the change event of the select element.
     *
     * @param {ChangeEvent<HTMLSelectElement>} event - the change event of the select element
     * @return {void}
     */
    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selectedModel = models.find((model: any) => `${model.provider} ${model.variant}` === selectedValue);

        if (selectedModel) {
            setModelContext({
                provider: selectedModel.provider,
                variant: selectedModel.variant,
                family: selectedModel.family,
                description: selectedModel.description,
                location: selectedModel.location,
            });
        }
    };

    useEffect(() => {
        // If the current modelInfo's variant is not the variantLock, update the context
        if (variantLock && modelInfo.variant !== variantLock && models) {
            const matchingModel = models.find((model: any) => model.variant === variantLock);
            if (matchingModel) {
                setModelContext({
                    provider: matchingModel.provider,
                    variant: matchingModel.variant,
                    family: matchingModel.family,
                    description: matchingModel.description,
                    location: matchingModel.location,
                });
            }
        }
    }, [variantLock, models, modelInfo, setModelContext]);

    return (
        <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="models">
                Model
            </label>
            <select
                className="govuk-select"
                id="models"
                name="models"
                value={`${modelInfo.provider} ${modelInfo.variant}`}
                onChange={handleSelectChange}
            >
                {modelsError && <option>Models failed to load</option>}
                {modelsLoading && <option>Loading...</option>}
                {models &&
                    models
                        .filter((model: any) => !variantLock || model.variant === variantLock)
                        .map((model: any, index: number) => (
                            <option key={index} value={`${model.provider} ${model.variant}`}>
                                {capitalCase(`${model.provider} ${model.variant}`)}
                            </option>
                        ))}
            </select>
        </div>
    );
};

export default ModelSelect;

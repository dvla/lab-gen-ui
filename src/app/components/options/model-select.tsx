import { ChangeEvent, useContext } from 'react';
import * as changeCase from 'change-case';
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

/**
/**
 * A component that renders a select box for choosing a model.
 * It tracks the current model context, and handles selection changes
 * to update the model context.
 */
const ModelSelect = () => {
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
                description: selectedModel.description,
                location: selectedModel.location,
            });
        }
    };

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
                    models.map((model: any, index: number) => (
                        <option key={index} value={`${model.provider} ${model.variant}`}>
                            {changeCase.capitalCase(`${model.provider} ${model.variant}`)}
                        </option>
                    ))}
            </select>
        </div>
    );
};

export default ModelSelect;

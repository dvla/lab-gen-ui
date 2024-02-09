'use client';
import { ChangeEvent, useState } from 'react';
import FixedPage from '../components/fixed-page';
import Generator, { Variable } from '../components/generator/generator';
import chatPageStyles from '../styles/ChatPage.module.scss';
import * as changeCase from 'change-case';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(async (res) => {
    if (!res.ok) {
        const response = await res.json()
        const error = new Error(response.error);
        throw error
      }
    return res.json()});
const SWR_OPTIONS = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 5
};

/**
 * PromptTemplate component to generate a prompt template based on the selected type and variables.
 *
 * @return {JSX.Element} The prompt template component
 */
const PromptTemplate = () => {
    const {
        data: models,
        error: modelsError,
        isLoading: modelsLoading,
    } = useSWR('/api/get-models', fetcher, SWR_OPTIONS);
    const {
        data: prompts,
        error: promptsError,
        isLoading: promptsLoading,
    } = useSWR('/api/get-prompts', fetcher, SWR_OPTIONS);
    const [type, setType] = useState('summary');
    const [model, setModel] = useState({ provider: 'AZURE', variant: 'GENERAL' });
    const [variables, setVariables] = useState([{ id: 'input', value: '' }]);
    const [previousVariables, setPreviousVariables] = useState<Variable[]>([]);

    /**
     * Handle the change event for the select element.
     *
     * @param {ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>} event - the change event
     * @return {void}
     */
    const handleRadioChange = (event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const tempPreviousVariables: Variable[] = previousVariables;
        //Update previousVariables for any previous input
        for (let variable of variables) {
            //If exists then update value otherwise add to list
            if (tempPreviousVariables.find((v: Variable) => v.id === variable.id)) {
                const index = tempPreviousVariables.findIndex((v: Variable) => v.id === variable.id);
                tempPreviousVariables[index] = variable;
            } else {
                tempPreviousVariables.push(variable);
            }
        }

        const tempVariables: Variable[] = [];
        //Get the new variables for the selected prompt type and use any previous input
        for (let prompt in prompts) {
            if (prompt === event.target.value) {
                for (let promptType of prompts[prompt]) {
                    let pv = '';
                    for (let previousVariable of tempPreviousVariables) {
                        if (previousVariable.id === promptType) {
                            pv = previousVariable.value;
                        }
                    }
                    tempVariables.push({ id: promptType, value: pv });
                }
            }
        }

        setType(event.target.value);
        setVariables(tempVariables);
        setPreviousVariables(tempPreviousVariables);
    };

    /**
     * Handles the change event of the select element.
     *
     * @param {ChangeEvent<HTMLSelectElement>} event - the change event of the select element
     * @return {void}
     */
    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const modelSplit = event.target.value.split(' ');
        setModel({ provider: modelSplit[0], variant: modelSplit[1] });
    };

    // Render the prompt template component
    return (
        <FixedPage backButton={true}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <h1 className="govuk-heading-l">Instant Productivity</h1>
                    <Generator type={type} variables={variables} showTabs={false} model={model} />
                </div>
                <div
                    className={'govuk-grid-column-one-third ' + chatPageStyles.gridRowHalf}
                    style={{ padding: '15px', backgroundColor: '#f3f2f1' }}
                >
                    <fieldset className="govuk-fieldset">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading">Settings</h1>
                        </legend>
                        <div className="govuk-form-group">
                            <label className="govuk-label" htmlFor="models">
                                Model
                            </label>
                            <select
                                className="govuk-select"
                                id="models"
                                name="models"
                                value={`${model.provider} ${model.variant}`}
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
                        <div className="govuk-form-group">
                            <label className="govuk-label" htmlFor="template">
                                Template
                            </label>
                            <div className="govuk-radios" data-module="govuk-radios">
                                {promptsError && <p className="govuk-body">Prompts failed to load</p>}
                                {promptsLoading && <p className="govuk-body">Loading...</p>}
                                {prompts &&
                                    Object.keys(prompts).map((key) => (
                                        <div className="govuk-radios__item" key={key}>
                                            <input
                                                className="govuk-radios__input"
                                                id={key}
                                                name={key}
                                                type="radio"
                                                value={key}
                                                checked={key === type}
                                                onChange={handleRadioChange}
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor={key}>
                                                {changeCase.capitalCase(key)}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </FixedPage>
    );
};

export default PromptTemplate;

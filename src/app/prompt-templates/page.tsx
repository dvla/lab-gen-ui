'use client';
import { ChangeEvent, useContext, useState } from 'react';
import FixedPage from '../components/fixed-page';
import Generator, { Variable } from '../components/generator/generator';
import chatPageStyles from '../styles/ChatPage.module.scss';
import { capitalCase } from '@/app/lib/utils';
import useSWR from 'swr';
import { SWR_OPTIONS, fetcher } from '../lib/fetchers';
import { modelContext } from '../config/model-context-config';
import ModelSelect from '../components/options/model-select';

/**
 * PromptTemplate component to generate a prompt template based on the selected prompt type and variables.
 *
 * @return {JSX.Element} The prompt template component
 */
const PromptTemplate = () => {
    const LANGUAGE = 'language';
    const DEFAULT_LANGUAGE = 'Welsh';
    const {
        data: prompts,
        error: promptsError,
        isLoading: promptsLoading,
    } = useSWR('/api/get-prompts', fetcher, SWR_OPTIONS);
    const [promptType, setPromptType] = useState('summary');
    const [variables, setVariables] = useState([{ id: 'input', value: '' }]);
    const [previousVariables, setPreviousVariables] = useState<Variable[]>([]);
    const { modelInfo } = useContext(modelContext);

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
                for (let promptID of prompts[prompt]) {
                    let pv = '';
                    for (let previousVariable of tempPreviousVariables) {
                        if (previousVariable.id === promptID) {
                            pv = previousVariable.value;
                        }
                    }
                    if (promptID === LANGUAGE && pv === '') {
                        pv = DEFAULT_LANGUAGE; // Set the default value for 'language'
                    }
                    tempVariables.push({ id: promptID, value: pv });
                }
            }
        }

        setPromptType(event.target.value);
        setVariables(tempVariables);
        setPreviousVariables(tempPreviousVariables);
    };

    // Render the prompt template component
    return (
        <FixedPage backButton={true} modelBanner={true}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <h1 className="govuk-heading-l">Instant Productivity</h1>
                    <Generator
                        promptType={promptType}
                        variables={variables}
                        showTabs={false}
                        model={modelInfo}
                        streaming={true}
                    />
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
                            <ModelSelect />
                        </div>
                        <div className="govuk-form-group">
                            <label className="govuk-label" htmlFor="template">
                                Template
                            </label>
                            <div className="govuk-radios" data-module="govuk-radios">
                                {promptsError && <p className="govuk-body">Prompts failed to load</p>}
                                {promptsLoading && <p className="govuk-body">Loading...</p>}
                                {prompts &&
                                    Object.keys(prompts)
                                    .sort((a, b) => b.localeCompare(a))
                                    .map((key) => (
                                        <div className="govuk-radios__item" key={key}>
                                            <input
                                                className="govuk-radios__input"
                                                id={key}
                                                name={key}
                                                type="radio"
                                                value={key}
                                                checked={key === promptType}
                                                onChange={handleRadioChange}
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor={key}>
                                                {capitalCase(key)}
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

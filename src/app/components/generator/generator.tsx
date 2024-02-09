'use client';
import { ChangeEvent, FormEventHandler, useEffect, useRef, useState } from 'react';
import chatPageStyles from '../../styles/ChatPage.module.scss';
import GeneratorTabs from './generator-tabs';
import * as changeCase from 'change-case';
import GeneratorHistory from './generator-history';
import { useSWRConfig } from 'swr';
import OneShot from '../one-shot/one-shot';

export interface Variable {
    id: string;
    value: string;
}

interface GeneratorProps {
    type: string;
    variables: Variable[];
    showTabs?: boolean;
    model: any;
}

/**
 * Component for generating forms based on input variables for pre-defined prompt templates.
 *
 * @param {GeneratorProps} type - the type of generator
 * @param {GeneratorProps} variables - the input variables for the form
 * @param {boolean} showTabs - whether to show tabs for the generator
 * @param {ModelProps} model - the model for the generator
 * @return {JSX.Element} the generated form component
 */
const Generator = ({ type, variables, showTabs = true, model }: GeneratorProps): JSX.Element => {
    // State variables
    const [start, setStart] = useState(true);
    const [shouldRender, setShouldRender] = useState(false);
    const [formData, setFormData] = useState(variables);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    // Ref for previous history value
    const prevHistory = useRef<string>();
    const { mutate } = useSWRConfig();

    // Update form data when variables change
    useEffect(() => {
        setFormData(variables);
    }, [variables]);

    /**
     * A function that handles the form input event.
     *
     * @param {FormEvent<HTMLFormElement>} event - the form input event
     * @return {void}
     */
    const handleInput: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (showTabs) {
            setStart(false);
        }

        if(shouldRender){
            mutate('/api/start-conversation');
        }
        else{
            setShouldRender(true);
        }
        
        setShowHistory(true);
        
    };

    /**
     * Resets the form to its default state.
     */
    const resetToDefaults = () => {
        if (showTabs) {
            setStart(true);
        }
        setShouldRender(false);
    };

    /**
     * Handles the input change event and updates the form data.
     *
     * @param {ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>} event - the input change event
     * @param {number} index - the index of the form data to update
     * @param {string} value - the new value to set
     * @return {void}
     */
    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
        index: number
    ) => {
        let newFormData = [...formData];
        newFormData[index].value = event.target.value;
        setFormData(newFormData);
    };

    
    /**
     * Updates the history with the given value if it's different from the previous value.
     *
     * @param {string} value - The new value to be added to the history
     * @return {void} 
     */
    const updateHistory = (value: string) => {
        if (!prevHistory.current) {
            setHistory([value, ...history]);
        } else if (prevHistory.current && value !== prevHistory.current) {
            setHistory([value, ...history]);
        }

        prevHistory.current = value;
    };

    return (
        <div className="govuk-grid-row ">
            {start && (
                <div className="govuk-grid-column-full">
                    <form onSubmit={handleInput}>
                        <fieldset className="govuk-fieldset">
                            {formData.map(({ id, value }, index) => (
                                <div className="govuk-form-group" key={id}>
                                    <label className="govuk-label" htmlFor={id}>
                                        {changeCase.capitalCase(id)}
                                    </label>
                                    {id === 'input' ? (
                                        <textarea
                                            className="govuk-textarea"
                                            id={id}
                                            name={id}
                                            value={value}
                                            rows={10}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    ) : (
                                        <input
                                            className="govuk-input"
                                            id={id}
                                            name={id}
                                            value={value}
                                            type="text"
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    )}
                                </div>
                            ))}
                        </fieldset>
                        <button type="submit" className="govuk-button govuk-button--start" data-module="govuk-button">
                            Generate
                        </button>
                    </form>
                </div>
            )}
            {shouldRender && (
                <div className={'govuk-grid-column-full ' + chatPageStyles.gridRowHalf}>
                    <OneShot variables={formData}
                        type={type}
                        model={model}
                        updateHistory={updateHistory}/>
                </div>
            )}
            {showHistory && (
                <div className={'govuk-grid-column-full ' + chatPageStyles.gridRowHalf}>
                    <GeneratorHistory history={history} />
                </div>
            )}
        </div>
    );
};

export default Generator;

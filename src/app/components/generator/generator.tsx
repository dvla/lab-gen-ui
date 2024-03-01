'use client';
import { ChangeEvent, FormEventHandler, useEffect, useRef, useState } from 'react';
import { useSWRConfig } from 'swr';
import * as changeCase from 'change-case';
import chatPageStyles from '../../styles/ChatPage.module.scss';
import GeneratorTabs from './generator-tabs';
import GeneratorHistory from './generator-history';
import OneShot from '../one-shot/one-shot';
import FileUpload from '@/app/image-to-text/file-upload';
import { usePathname, useRouter } from 'next/navigation';
import { Model } from '@/app/lib/fetchers';

/**
 * Represents a variable with an id and value.
 */
export interface Variable {
    /**
     * The unique identifier for the variable.
     */
    id: string;
    /**
     * The value of the variable.
     */
    value: string;
    /*
     * Show the variable input on the page
     */
    show?: boolean;
    /*
     * Name of variable if different form id
     */
    name?: string;
}

/**
 * Interface for response history
 */
export interface ResponseHistory {
    /**
     * Data field
     */
    data: string;
    /**
     * Model field
     */
    model: Model;
}

interface GeneratorProps {
    promptType?: string;
    model: any;
    variables: Variable[];
    file?: File;
    showTabs?: boolean;
    showHistory?: boolean;
    showFileUpload?: boolean;
}

/**
 * Component for generating forms based on input variables for pre-defined prompt templates.
 *
 * @param {GeneratorProps} promptType - the type of prompt
 * @param {GeneratorProps} variables - the input variables for the form
 * @param {boolean} showTabs - whether to show tabs for the generator
 * @param {ModelProps} model - the model for the generator
 * @return {JSX.Element} the generated form component
 */
const Generator = ({
    promptType,
    model,
    variables,
    showTabs = true,
    showHistory = true,
    showFileUpload = false,
}: GeneratorProps): JSX.Element => {
    // State variables
    const [start, setStart] = useState(true);
    const [shouldRender, setShouldRender] = useState(false);
    const [formData, setFormData] = useState(variables);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [viewHistory, setViewHistory] = useState(showHistory);
    const [history, setHistory] = useState<ResponseHistory[]>([]);
    // Ref for previous history value
    const prevHistory = useRef<string>();
    const { mutate } = useSWRConfig();
    const router = useRouter();
    const pathname = usePathname();

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

        if (shouldRender) {
            mutate('/api/start-conversation');
        } else {
            setShouldRender(true);
        }

        if (showHistory) {
            setViewHistory(true);
        }
    };

    /**
     * Resets the form to its default state.
     */
    const resetToDefaults = () => {
        setHistory([]);
        if (showTabs) {
            setStart(true);
        }
        setShouldRender(false);
        router.replace(pathname);
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
     * Handles the file upload event.
     *
     * @param {ChangeEvent<HTMLInputElement>} event - the change event
     * @return {void}
     */
    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        } else {
            setFile(undefined);
        }
    };

    /**
     * Updates the history with the given value if it's different from the previous value.
     *
     * @param {string} value - The new value to be added to the history
     * @return {void}
     */
    const updateHistory = (value: string) => {
        const responseHistory: ResponseHistory = {
            data: value,
            model: model,
        };
        if (!prevHistory.current) {
            setHistory([responseHistory, ...history]);
        } else if (prevHistory.current && value !== prevHistory.current) {
            setHistory([responseHistory, ...history]);
        }

        prevHistory.current = value;
    };

    const showGeneratorFields = (formData: Variable[]) => {
        return formData.map(({ id, value, show, name }, index) =>
            show === false ? null : (
                <div className="govuk-form-group" key={id}>
                    <label className="govuk-label" htmlFor={id}>
                        {changeCase.capitalCase(name ? name : id)}
                    </label>
                    {id === 'input' || id === 'description' ? (
                        <div>
                            <textarea
                                className="govuk-textarea"
                                id={id}
                                name={id}
                                value={value}
                                rows={10}
                                onChange={(e) => handleInputChange(e, index)}
                            />
                            {showFileUpload && (
                                <input
                                    className="govuk-file-upload"
                                    id={`${id}-file`} // Ensure the ID is unique for files
                                    name={`${id}-file`}
                                    type="file"
                                    accept=".jpeg,.jpg,.png"
                                    onChange={(e) => handleFileUpload(e)}
                                />
                            )}
                        </div>
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
            )
        );
    };

    return (
        <div className="govuk-grid-row ">
            {start && (
                <div className="govuk-grid-column-full">
                    <form onSubmit={handleInput}>
                        <fieldset className="govuk-fieldset">{showGeneratorFields(formData)}</fieldset>
                        <button type="submit" className="govuk-button" data-module="govuk-button">
                            Generate
                        </button>
                    </form>
                </div>
            )}
            {!showTabs && shouldRender && (
                <div className={'govuk-grid-column-full ' + chatPageStyles.gridRowHalf}>
                    {promptType && <OneShot variables={formData} promptType={promptType} model={model} updateHistory={updateHistory} />}
                </div>
            )}
            {showTabs && shouldRender && !showFileUpload && (
                <div className="govuk-grid-column-full">
                    {promptType && <GeneratorTabs promptType={promptType} reset={resetToDefaults} model={model} variables={formData} />}
                </div>
            )}
            {showTabs && shouldRender && showFileUpload && (
                <div className={'govuk-grid-column-full ' + chatPageStyles.gridRowHalf}>
                    {file && <FileUpload reset={resetToDefaults} variables={formData} model={model} file={file} />}
                </div>
            )}
            {viewHistory && (
                <div className={'govuk-grid-column-full ' + chatPageStyles.gridRowHalf}>
                    <GeneratorHistory history={history} />
                </div>
            )}
        </div>
    );
};

export default Generator;

import { useEffect, useState } from 'react';
import { Spinner } from 'govuk-react';
import { Tabs } from 'govuk-frontend';
import { Variable } from '../components/generator/generator';
import ReactMarkdown from 'react-markdown';
import jiraStyles from '../styles/Jira.module.scss';
import generatorStyles from '../styles/Generator.module.scss';

import { Model } from '@/app/lib/fetchers';
import Image from 'next/image';
import useStream from '../hooks/useStream';

const FILE_API_ENDPOINT = '/api/gen/image';

interface FileUploadProps {
    reset: () => void;
    variables: Variable[];
    model: Model;
    file: File;
}

const FileUpload = ({ reset, model, file, variables }: FileUploadProps) => {
    const [fileBase64, setFileBase64] = useState<string>('');
    const [errorState, setErrorState] = useState<Error | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let config: any;
            config = typeof config !== 'undefined' ? config : {};
            var $scope = config.scope instanceof HTMLElement ? config.scope : document;
            let $tabs: HTMLElement[] = $scope.querySelectorAll('[data-module="govuk-tabs"]');
            for (let tab of $tabs) {
                new Tabs(tab).init();
            }
        }
    }, []);

    useEffect(() => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/api/image-to-base64', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setErrorState(new Error(data.error));
                } else {
                    setFileBase64(data.base64);
                }
            })
            .catch((error) => {
                setErrorState(error);
            });
    }, [file]);

    //Checks that fileBase64 has been set
    const shouldFetch = !!fileBase64;
    let body = {};

    const { data, error, isLoading, streamingFinished } = useStream(
        shouldFetch ? { model, variables, fileBase64, fileType: file.type, apiEndpoint: FILE_API_ENDPOINT } : {}
    );

    if (errorState || error) {
        const errorMessage = errorState ? errorState.message : error || 'Unknown error';
        return (
            <div className="govuk-error-summary" data-module="govuk-error-summary">
                <div role="alert">
                    <h2 className="govuk-error-summary__title">There is a problem</h2>
                    <div className="govuk-error-summary__body">
                        <ul className="govuk-list govuk-error-summary__list">
                            <li>
                                <a href="#">{errorMessage}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="govuk-tabs" data-module="govuk-tabs">
                <h2 className="govuk-tabs__title">Contents</h2>
                <ul className="govuk-tabs__list">
                    <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
                        <a className={`govuk-tabs__tab ${generatorStyles.tabLoading}`} href="#result">
                            Result
                            {!streamingFinished && (
                                <Spinner
                                    fill="#b1b4b6"
                                    height="20px"
                                    title="Example Spinner implementation"
                                    width="20px"
                                    style={{ marginLeft: '5px' }}
                                />
                            )}
                        </a>
                    </li>
                    <li className="govuk-tabs__list-item">
                        <a className="govuk-tabs__tab" href="#image">
                            Uploaded Image
                        </a>
                    </li>
                </ul>
                <div className="govuk-tabs__panel" id="result">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                            {isLoading ? (
                                // Render spinner if loading or validating
                                <Spinner
                                    fill="#b1b4b6"
                                    height="56px"
                                    title="Example Spinner implementation"
                                    width="56px"
                                />
                            ) : (
                                <ReactMarkdown className={jiraStyles.historyResponse}>{data}</ReactMarkdown>
                            )}
                        </div>
                    </div>
                </div>
                <div className="govuk-tabs__panel govuk-tabs__panel--hidden" id="image">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                            <div>
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt="Uploaded Image"
                                    layout="responsive"
                                    width={500}
                                    height={500}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="govuk-button-group">
                <button className="govuk-button govuk-button--secondary" onClick={reset}>
                    Reset
                </button>
            </div>
        </>
    );
};

export default FileUpload;

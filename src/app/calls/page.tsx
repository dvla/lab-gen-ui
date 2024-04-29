'use client';
import { useContext, useState } from 'react';
import FixedPage from '../components/fixed-page';
import Generator, { Variable } from '../components/generator/generator';
import chatPageStyles from '../styles/ChatPage.module.scss';
import ModelSelect from '../components/options/model-select';
import { modelContext } from '../config/model-context-config';

const Summary = () => {
    const [variables, setVariables] = useState<Variable[]>([{ id: 'input', value: '', name: 'description' }]);
    const { modelInfo } = useContext(modelContext);

    return (
        <FixedPage backButton={true} modelBanner={true}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <h1 className="govuk-heading-l">Call Summary</h1>
                    <Generator
                        promptType="call_summary"
                        variables={variables}
                        showTabs={false}
                        model={modelInfo}
                        apiEndpoint="/api/gen/structured/call"
                        streaming={false}
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
                    </fieldset>
                </div>
            </div>
        </FixedPage>
    );
};

export default Summary;

'use client';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import FixedPage from '../components/fixed-page';
import Generator, { Variable } from '../components/generator/generator';
import { modelContext } from '../config/model-context-config';
import ModelSelect from '../components/options/model-select';
import chatPageStyles from '../styles/ChatPage.module.scss';

const TextToDiagram = () => {
    const DIAGRAM_TYPE = 1;
    const [promptType, setPromptType] = useState('diagram');
    const [diagramType, setDiagramType] = useState('sequence');
    const [variables, setVariables] = useState<Variable[]>([
        { id: 'input', value: '', name: 'description' },
        { id: 'diagram_type', value: diagramType, show: false },
    ]);
    const { modelInfo } = useContext(modelContext);

    // Sets the diagram type back to sequence if an advanced diagram is selected with a general model
    useEffect(() => {
        if(modelInfo.variant != 'ADVANCED' && diagramType.startsWith('*')) {
            setDiagramType('sequence');
        }
    }, [modelInfo.variant, diagramType]);

    /**
     * Handles the change event of the select element.
     *
     * @param {ChangeEvent<HTMLSelectElement>} event - The change event of the select element
     * @return {void} 
     */
    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        let tempVariables = [...variables];
        tempVariables[DIAGRAM_TYPE].value = event.target.value;
        setDiagramType(event.target.value);
        setVariables(tempVariables);
    };

    return (
        <FixedPage backButton={true} modelBanner={true}>
            <main>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-two-thirds">
                        <h1 className="govuk-heading-l">Diagram Generator</h1>
                        <Generator type={promptType} variables={variables} model={modelInfo} showHistory={false} />
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
                                <label className="govuk-label" htmlFor="diagram-type">
                                    Select a diagram type
                                </label>
                                <div className="govuk-hint" id="diagram-type-hint">
                                    * work with advanced models
                                </div>
                                <select
                                    className="govuk-select"
                                    id="diagram-type"
                                    name="diagram-type"
                                    aria-describedby="diagram-type-hint"
                                    onChange={handleSelectChange}
                                    value={diagramType}
                                >
                                    <option value="sequence">Sequence</option>
                                    <option value="class">Class</option>
                                    <option value="flowchart">Flowchart</option>
                                    <option value="state">State</option>
                                    <option value="enitity relationship">Entity Relationship</option>
                                    <option value="gantt">Gantt</option>
                                    <option value="pie chart">Pie Chart</option>
                                    <option value="requirement">Requirement</option>
                                    <option value="*user journey" disabled={modelInfo.variant !== 'ADVANCED'}>* User Journey</option>
                                    <option value="*c4 - system context" disabled={modelInfo.variant !== 'ADVANCED'}>* C4 - System Context</option>
                                    <option value="*c4 - container" disabled={modelInfo.variant !== 'ADVANCED'}>* C4 - Container</option>
                                    <option value="*c4 - deployment" disabled={modelInfo.variant !== 'ADVANCED'}>* C4 - Deployment</option>
                                    <option value="*c4 - dynamic" disabled={modelInfo.variant !== 'ADVANCED'}>* C4 - Dynamic</option>
                                </select>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </main>
        </FixedPage>
    );
};

export default TextToDiagram;

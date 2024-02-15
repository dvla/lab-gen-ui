import { GherkinDocument } from '@cucumber/messages';

/**
 * Validates that all scenarios in the given GherkinDocument have unique titles.
 *
 * @param doc - The GherkinDocument to validate.
 * @returns A boolean indicating if all scenario titles are unique, or undefined if no feature is present.
 */
export const validateUniqueScenarioTitles = (doc: GherkinDocument): boolean => {
    if (doc.feature) {
        const titles = new Set<string>();
        return doc.feature.children.every((child) => {
            if (child.scenario && child.scenario.name) {
                const name = child.scenario.name;
                if (titles.has(name)) {
                    return false;
                }
                titles.add(name);
            }
            return true;
        });
    }

    // default
    return false;
};

/**
 * Validates that all scenarios in the Gherkin document have steps defined.
 *
 * @param doc - The Gherkin document to validate.
 * @returns A boolean indicating if all scenarios have steps, or undefined if no feature exists.
 */
export const validateScenarioSteps = (doc: GherkinDocument): boolean => {
    if (doc.feature) {
        return doc.feature.children.every((children) => children.scenario?.steps && children.scenario.steps.length > 0);
    }
    // default
    return false;
};

/**
 * Validates that all steps in each scenario use valid step keywords.
 *
 * @param doc - The Gherkin document to validate.
 * @returns A boolean indicating if all steps have valid keywords,
 * or undefined if no feature exists.
 */
export const validateStepKeywords = (doc: GherkinDocument): boolean => {
    if (doc.feature) {
        const stepKeywords = ['Given', 'When', 'Then', 'And'];
        return doc.feature.children.every(
            (child) =>
                child.scenario?.steps.every((step: { keyword: string }) => stepKeywords.includes(step.keyword.trim()))
        );
    }

    // default
    return false;
};

/**
 * Performs full validation on the given Gherkin document.
 *
 * Checks that all scenario titles are unique, all scenarios have steps,
 * and all steps use valid keywords.
 *
 * @param gherkinDocument - The Gherkin document to validate.
 * @returns A boolean indicating if the document is fully valid.
 */
export const fullValidation = (gherkinDocument: GherkinDocument) => {
    const validTitles = validateUniqueScenarioTitles(gherkinDocument);
    const validSteps = validateScenarioSteps(gherkinDocument);
    const validKeywords = validateStepKeywords(gherkinDocument);

    return {
        titles: validTitles,
        steps: validSteps,
        keywords: validKeywords,
        valid: validTitles && validSteps && validKeywords
    };
};

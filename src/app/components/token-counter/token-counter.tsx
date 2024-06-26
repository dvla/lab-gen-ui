import { useContext, useEffect, useState } from 'react';
import tokenStyles from '../../styles/TokenCounter.module.scss';
import { ModelFamily, modelContext } from '@/app/config/model-context-config';
import { env, AutoTokenizer } from '@xenova/transformers';

env.allowLocalModels = false;

/**
 * Props for the TokenCounter component.
 *
 * @prop text The text to be tokenized.
 * @prop modelFamily The model family.
 */
interface TokenCounterProps {
    /** The text to be tokenized. */
    text: string | null;
    /** The model family. */
    modelFamily?: ModelFamily;
}

/**
 * The name of the Claude tokenizer model.
 */
const CLAUDE_TOKENIZER = 'Xenova/claude-tokenizer';
/**
 * The name of the GPT-4 tokenizer model.
 */
const GPT4_TOKENIZER = 'Xenova/gpt-4';
/**
 * The name of the Mistral tokenizer model.
 */
const MISTRAL_TOKENIZER = 'Xenova/mistral-tokenizer';

/**
 * Renders the TokenCounter component based on the provided text, tokenIds, decodedTokens, margins, and tokenizer.
 *
 * @param {TokenCounterProps} text - The text to be tokenized.
 * @return {JSX.Element} The JSX element representing the TokenCounter component.
 */
const TokenCounter = ({ text, modelFamily }: TokenCounterProps) => {
    const [tokenizer, setTokenizer] = useState(GPT4_TOKENIZER);
    const [tokens, setTokens] = useState<number>(0);
    const { modelInfo } = useContext(modelContext);

    // Set the tokenizer based on the current model.
    // Claude model uses Claude tokenizer.
    // Google model uses GPT-4 tokenizer. (Gemma model was slow)
    // All other models use GPT-4 tokenizer.
    useEffect(() => {
        switch (modelFamily ? modelFamily : modelInfo.family) {
            case ModelFamily.CLAUDE:
                setTokenizer(CLAUDE_TOKENIZER);
                break;
            case ModelFamily.MISTRAL:
                setTokenizer(MISTRAL_TOKENIZER);
                break;
            default:
                setTokenizer(GPT4_TOKENIZER);
        }
    }, [modelFamily, modelInfo]);

    // Post the current text and tokenizer to the worker thread when they change.
    // This allows the worker to tokenize the text in the background.
    useEffect(() => {
        if (text) {
            calculateTokens(tokenizer, text);
        }
    }, [text, tokenizer]);

    /**
     * Calculates the tokens for a given text using the specified model.
     *
     * @param {string} model_id - The ID of the model to use for tokenization.
     * @param {string} tokenText - The text to tokenize.
     * @return {Promise<void>} A promise that resolves when the tokens have been calculated and set.
     */
    const calculateTokens = async (model_id: string, tokenText: string) => {
        const tokenizer = await AutoTokenizer.from_pretrained(model_id);
        const text = tokenText;
        const token_ids = tokenizer.encode(text);
        setTokens(token_ids.length);
    };

    return (
        <>
            {text && (
                <div id="more-detail-hint" className={`govuk-hint ${tokenStyles.tokenText}`}>
                    Tokens: {tokens} Characters: {text.length.toString()}
                </div>
            )}
        </>
    );
};

export default TokenCounter;

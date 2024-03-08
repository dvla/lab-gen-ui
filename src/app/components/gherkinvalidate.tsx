import ReactMarkdown from 'react-markdown';
import useSWR from 'swr';
import jiraStyles from '../styles/Jira.module.scss';
import { useState } from 'react';
import { Tag, WarningText } from 'govuk-react';

interface GherkinValidateProps {
    content: string;
}

/**
 * Validates Gherkin content passed in props.content.
 * Fetches validation from /api/gherkin endpoint.
 * Displays parsed content and validation message.
 */
const GherkinValidate = ({ content }: GherkinValidateProps) => {
    const [body, setBody] = useState(content);
    const { data, error, isLoading } = useSWR(
        '/api/gherkin',
        (url: string) =>
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }).then(async (res) => {
                const result = await res.json();
                if (res.status !== 200) {
                    throw new Error(result.message);
                }
                return result;
            }),
        { shouldRetryOnError: false }
    );
    if (error) return <WarningText>Error parsing Gherkin code, please try again</WarningText>;
    if (isLoading) return <ReactMarkdown className={jiraStyles.historyResponse}>{content}</ReactMarkdown>;

    return (
        <>
            <ReactMarkdown className={jiraStyles.historyResponse}>{data.content}</ReactMarkdown>
            { data.validation.valid ? <Tag tint="GREEN">{data.message}</Tag> : <Tag tint="YELLOW">{data.message}</Tag> }
        </>
    );
};

export default GherkinValidate;

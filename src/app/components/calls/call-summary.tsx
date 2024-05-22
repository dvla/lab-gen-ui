import { useEffect, useState } from 'react';
import callSummaryStyles from '../../styles/CallSummary.module.scss';
import moment from 'moment-timezone';
import { capitalCase, TIMEZONE } from '@/app/lib/utils';
import VehicleSummary, { Vehicle } from '@/app/components/calls/vehicle-summary';
import DriverSummary, { Driver } from '@/app/components/calls/driver-summary';
import ErrorComponent from '@/app/components/error';

interface CallSummaryProps {
    callData: string;
}

/**
 * Represents the call details extracted from the transcript.
 */
interface CallDetails {
    startTime: string;
    endTime: string;
    sentiment: string;
    topics: string;
    category: string[];
    participants: string;
    customerSituation: string;
    desiredOutcome: string;
    resolution: string;
    steps: string[];
    actions: string;
    fcr: boolean;
    vehicle: Vehicle;
    driver: Driver;
}

/**
 * Renders a call summary
 */
const CallSummary = ({ callData }: CallSummaryProps) => {
    const [callDetails, setCallDetails] = useState<CallDetails>();
    const [error, setError] = useState<string>('');
    useEffect(() => {
        const jsonDetails = JSON.parse(callData);
        if (jsonDetails && jsonDetails.detail) {
            setError(jsonDetails.detail);
        } else {
            setError('');
            setCallDetails(jsonDetails);
        }
        if (jsonDetails) {
            console.log(jsonDetails);
        }
    }, [callData]);

    /**
     * Returns the CSS class name for the tag color based on the sentiment value.
     * @param sentiment - The sentiment value.
     * @returns The CSS class name for the tag color.
     */
    const getTagColour = (sentiment: string) => {
        switch (sentiment.toUpperCase()) {
            case 'NEUTRAL':
                return 'govuk-tag--blue';
            case 'POSITIVE':
                return 'govuk-tag--green';
            case 'NEGATIVE':
                return 'govuk-tag--orange';
            default:
                return 'govuk-tag--grey';
        }
    };

    /**
     * Calculates call duration
     * @param startTime
     * @param endTime
     * @returns Duration as a string
     */
    const getDuration = (startTime: string, endTime: string) => {
        const start = moment(startTime).tz(TIMEZONE);
        const end = moment(endTime).tz(TIMEZONE);
        const duration = moment.duration(end.diff(start));
        return `${start.format('D-MMM kk:mm')} to ${end.format('kk:mm')} : ${duration.asSeconds()} secs`;
    };

    if (error) {
        return <ErrorComponent error={error} reset={() => window.location.reload()} />;
    }

    return (
        <>
            {callDetails && callDetails.startTime && (
                <div id="top" className={`${callSummaryStyles.bar} ${callSummaryStyles.callBar}`}>
                    <div
                        className="govuk-summary-list govuk-summary-list--no-border govuk-!-margin-bottom-2"
                        id="call_details"
                    >
                        <div className={`govuk-summary-list__row ${callSummaryStyles.summaryHeading}`}>
                            <h3 className="govuk-heading-m section-heading" id="call-heading">
                                Call : {getDuration(callDetails.startTime, callDetails.endTime)}
                            </h3>
                            {callDetails.fcr && (
                                <strong>
                                    <span className="govuk-tag govuk-tag--yellow">FCR</span>
                                </strong>
                            )}
                            {callDetails.sentiment && (
                                <strong
                                    className={`govuk-tag ${callSummaryStyles.sentiment} ${getTagColour(
                                        callDetails.sentiment
                                    )}`}
                                >
                                    {callDetails.sentiment}
                                </strong>
                            )}
                        </div>
                    </div>

                    <dl className="govuk-summary-list" id="call-details">
                        {callDetails.topics && (
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">Topics</dt>
                                <dd className="govuk-summary-list__value">{callDetails.topics}</dd>
                            </div>
                        )}
                        {callDetails.category && (
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">Categories</dt>
                                <dd className="govuk-summary-list__value">
                                    {capitalCase(callDetails?.category.join(' / '))}
                                </dd>
                            </div>
                        )}
                        {callDetails.participants && (
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">Participants</dt>
                                <dd className="govuk-summary-list__value">{callDetails.participants}</dd>
                            </div>
                        )}
                        {callDetails.customerSituation && (
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">Customer Situation</dt>
                                <dd className="govuk-summary-list__value">{callDetails.customerSituation}</dd>
                            </div>
                        )}
                        {callDetails.desiredOutcome && (
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">Desired Outcome</dt>
                                <dd className="govuk-summary-list__value">{callDetails.desiredOutcome}</dd>
                            </div>
                        )}
                        {callDetails.steps && (
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">Steps Taken</dt>
                                <dd className="govuk-summary-list__value">
                                    <ul className="govuk-list govuk-list--bullet">
                                        {callDetails.steps.map((step, index) => (
                                            <li key={index}>{step}</li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        )}
                        {callDetails.resolution && (
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">Call Resolution</dt>
                                <dd className={`${callSummaryStyles.callActions} govuk-summary-list__value`}>
                                    {callDetails.resolution}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            )}
            {callDetails && callDetails.vehicle && <VehicleSummary vehicle={callDetails.vehicle} />}
            {callDetails && callDetails.driver && <DriverSummary driver={callDetails.driver} />}
        </>
    );
};

export default CallSummary;

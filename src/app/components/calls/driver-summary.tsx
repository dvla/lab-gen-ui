import callSummaryStyles from '@/app/styles/CallSummary.module.scss';
import moment from 'moment-timezone';

/**
 * Represents a driver.
 */
export interface Driver {
    /**
     * The driving licence number of the driver.
     */
    drivingLicenceNumber: string;

    /**
     * The title of the driver.
     */
    title: string;

    /**
     * The first names of the driver.
     */
    firstNames: string;

    /**
     * The last name of the driver.
     */
    lastName: string;

    /**
     * The date of birth of the driver.
     */
    dateOfBirth: string;

    /**
     * The postcode of the driver.
     */
    postcode: string;
}

/**
 * Represents the props for the DriverSummary component.
 */
export interface DriverSummaryProps {
    driver: Driver;
}

/**
 * Renders the summary of a driver.
 *
 * @param {DriverSummaryProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const DriverSummary = ({ driver }: DriverSummaryProps) => {
    if (driver) {
        return (
            <div id="topDriver" className={`${callSummaryStyles.bar} ${callSummaryStyles.driverBar}`}>
                <div
                    className="govuk-summary-list govuk-summary-list--no-border govuk-!-margin-bottom-2"
                    id="driver_details"
                >
                    <div className={`govuk-summary-list__row ${callSummaryStyles.summaryHeading}`}>
                        <h3 className="govuk-heading-m section-heading" id="driver-heading">
                            Driver Details
                        </h3>
                    </div>
                </div>
                <dl className="govuk-summary-list" id="vehicle-list-details">
                    {driver.title && (
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Title</dt>
                            <dd className="govuk-summary-list__value">{driver.title}</dd>
                        </div>
                    )}
                    {driver.firstNames && (
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Name</dt>
                            <dd className="govuk-summary-list__value">
                                {driver.firstNames} {driver.lastName}
                            </dd>
                        </div>
                    )}
                    {driver.dateOfBirth && (
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Date of Birth</dt>
                            <dd className="govuk-summary-list__value">
                                {moment(driver.dateOfBirth).format('Do MMMM YYYY')}
                            </dd>
                        </div>
                    )}
                    {driver.postcode && (
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Postcode</dt>
                            <dd className="govuk-summary-list__value">{driver.postcode}</dd>
                        </div>
                    )}
                    {driver.drivingLicenceNumber && (
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Driving licence number</dt>
                            <dd className="govuk-summary-list__value">{driver.drivingLicenceNumber}</dd>
                        </div>
                    )}
                </dl>
            </div>
        );
    }
};

export default DriverSummary;

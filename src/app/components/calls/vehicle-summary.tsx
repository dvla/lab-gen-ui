import callSummaryStyles from '@/app/styles/CallSummary.module.scss';

/**
 * Represents a vehicle.
 */
export interface Vehicle {
    registrationNumber: string;
    make: string;
    model: string;
    colour: string;
    registrationDocumentId: string;
}

/**
 * Props for the VehicleSummary component.
 */
export interface VehicleSummaryProps {
    vehicle: Vehicle;
}

/**
 * Renders the summary of a vehicle.
 *
 * @param {VehicleSummaryProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const VehicleSummary = ({ vehicle }: VehicleSummaryProps) => {
    if (vehicle) {
        return (
            <div id="topVehicle" className={`${callSummaryStyles.bar} ${callSummaryStyles.vehicleBar}`}>
                <div
                    className="govuk-summary-list govuk-summary-list--no-border govuk-!-margin-bottom-2"
                    id="vehicle_details"
                >
                    <div className={`govuk-summary-list__row ${callSummaryStyles.summaryHeading}`}>
                        <h3 className="govuk-heading-m section-heading" id="call-heading">
                            Vehicle Details
                        </h3>
                    </div>
                </div>
                <dl className="govuk-summary-list" id="vehicle-list-details">
                    {vehicle.registrationNumber && (
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Reg number</dt>
                            <dd className="govuk-summary-list__value">
                                <span className="reg-mark-sm" id="registration-number-0">
                                    {vehicle.registrationNumber}
                                </span>
                            </dd>
                        </div>
                    )}
                    {vehicle.make && (
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Make</dt>
                            <dd className="govuk-summary-list__value">{vehicle.make}</dd>
                        </div>
                    )}
                    {vehicle.model && (
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Model</dt>
                            <dd className="govuk-summary-list__value">{vehicle.model}</dd>
                        </div>
                    )}
                    {vehicle.colour && (
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Colour</dt>
                            <dd className="govuk-summary-list__value">{vehicle.colour}</dd>
                        </div>
                    )}
                    {vehicle.registrationDocumentId && (
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Doc ID</dt>
                            <dd className="govuk-summary-list__value">{vehicle.registrationDocumentId}</dd>
                        </div>
                    )}
                </dl>
            </div>
        );
    }
};

export default VehicleSummary;

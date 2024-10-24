import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import CallSummary from '../src/app/components/calls/call-summary';

describe('CallSummary', () => {
    it('renders a Call Summary', () => {
        const callData = `{
      "startTime": "2024-04-15T16:30:33Z",
      "endTime": "2024-04-15T16:33:26Z",
      "participants": "Bob James, Customer",
      "category": [
        "Vehicle"
      ],
      "sentiment": "neutral"
    }`;
        const tree = render(<CallSummary callData={callData} />);
        expect(tree).toMatchSnapshot();
    });

    it('renders a Blank Summary', () => {
        const callData = `{}`;
        const tree = render(<CallSummary callData={callData} />);
        expect(tree).toMatchSnapshot();
    });

    it('renders a Vehicle', () => {
        const callData = `{
      "sentiment": "neutral",
      "vehicle": {
        "registrationNumber": "ABC123",
        "make": "Peugeot",
        "model": "205 GTI",
        "colour": "Black",
        "registrationDocumentId": "012345678"
      }
    }`;
        const tree = render(<CallSummary callData={callData} />);
        expect(tree).toMatchSnapshot();
    });

    it('renders a Driver', () => {
        const callData = `{
      "driver": {
        "drivingLicenceNumber": "FRED230586",
        "firstNames": "Ken",
        "lastName": "Jones",
        "postcode": "SA28 0FJ"
      }
    }`;
        const tree = render(<CallSummary callData={callData} />);
        expect(tree).toMatchSnapshot();
    });
});

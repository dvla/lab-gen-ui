import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import Script from 'next/script';
import ModelContextProvider from "./model-context"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Lab Gen AI Demos',
    description: 'Emerging Tech Lab generative AI demos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={'govuk-template__body' + inter.className}>
                <Script id="govuk-frontend-body">{ "document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '');"}</Script>
                <ModelContextProvider>{children}</ModelContextProvider>
            </body>
        </html>
    );
}

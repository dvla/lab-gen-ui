'use client';
import { H1, Page } from 'govuk-react';
import AuthProvider from '@/app/components/auth-provider';
import Login from '@/app/components/login';

export default function AuthTest() {
    return (
        <>
            <Page>
                <H1>Authentication Test</H1>
                < AuthProvider>
                    <Login />
                </AuthProvider>
            </Page>
        </>
    );
}

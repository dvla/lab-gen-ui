'use client';
import { H1, Page } from 'govuk-react';
import AuthProvider from '@/app/components/auth-provider';
import Login from '@/app/components/login';

const AuthTest = () => {
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

export default AuthTest;

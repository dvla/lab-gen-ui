'use client';
import { Button } from 'govuk-react';
import { useSession } from 'next-auth/react';
import { loginAction, logoutAction } from '@/app/lib/actions';
import { Tag } from 'govuk-react';
import styles from '@/app/styles/Login.module.scss';

/**
 * Renders the login component.
 *
 * It uses the "useSession" hook to get the current user's session data and status.
 * If the user is authenticated, it displays their email and a sign out button.
 * If the user is not authenticated, it displays a sign in button.
 */
const Login = () => {
    const { data: session, status } = useSession();
    const userEmail = session?.user?.email?.split('.')[0] as string;

    if (status === 'authenticated') {
        return (
            <>
                <div style={containerStyle}>
                    <Tag tint="PURPLE">{userEmail}</Tag>
                    <form action={logoutAction} style={formStyle}>
                        <Button className={styles.loginButton}>Sign Out</Button>
                    </form>
                </div>
            </>
        );
    }

    return (
        <>
            <div style={containerStyle}>
                <form action={loginAction} style={formStyle}>
                    <Button className={styles.loginButton}>Sign in</Button>
                </form>
            </div>
        </>
    );
};

const formStyle = { display: 'flex', alignItems: 'center' };
const containerStyle = { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' };

export default Login;

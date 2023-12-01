'use server';
import { signIn, signOut } from './auth';
import { redirect } from 'next/navigation';

/**
 * Logs in the user and redirects to the authenticated page.
 *
 * @return {Promise<void>} - A promise that resolves when the login action is complete.
 */
export async function loginAction() {
    const url = await signIn('cognito', { redirect: false });
    redirect(url.replace('signin', 'api/auth/signin'));
}

/**
 * Logs out the user.
 *
 * @return {Promise<void>} A promise that resolves when the user has been successfully signed out.
 */
export async function logoutAction() {
    await signOut();
}
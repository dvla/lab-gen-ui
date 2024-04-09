import type { Session } from 'next-auth';

/**
 * Retrieves the business user email from the session object.
 *
 * @param {Session} session - The session object containing user information.
 * @return {string} The unique identifier for the business user.
 */
export const getBusinessUser = (session: Session): string => {
    return session?.user?.email?.split('@')[0] || '';
};
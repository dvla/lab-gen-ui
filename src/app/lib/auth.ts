import NextAuth from "next-auth"
import CognitoProvider from "next-auth/providers/cognito";
import type { NextAuthConfig } from "next-auth";

export const config = {
    // Configure Cognito
    providers: [
        CognitoProvider({
            clientId: process.env.AUTH_COGNITO_CLIENT_ID as string,
            clientSecret: process.env.AUTH_COGNITO_CLIENT_SECRET as string,
            issuer: process.env.AUTH_OGNITO_ISSUER,
        }),
    ],
    debug: process.env.NODE_ENV === 'development' ? true : false,
    // callbacks: {
    //     async signIn({ user, account, profile, email, credentials }) {
    //       if (account && account.provider === 'cognito') {
    //           return profile && profile.email && profile.email.endsWith('@dvla.gov.uk');
    //       }
    //       return true;
    //     },
    //     async session({ session, user, token }) {
    //         return session;
    //     },
    //     async jwt({ token, user, account, profile, isNewUser }) {
    //         return token;
    //     },
    // },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config)

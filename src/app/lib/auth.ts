import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

let localProvider = null;
const localUser = { id: '1', name: 'Local Dev', email: 'local.dev@example.com' };

if (process.env.AUTH_LOCAL_PASSWORD) {  
    localProvider = CredentialsProvider({  
        name: 'Credentials',  
        credentials: {  
            username: { label: 'Username', type: 'text', placeholder: 'admin' },  
            password: { label: 'Password', type: 'password' },  
        },  
        async authorize(credentials, req) {  
            if (credentials.password === process.env.AUTH_LOCAL_PASSWORD) {  
                return localUser;  
            } else {  
                return null;  
            }  
        },  
    });  
}  

export const config = {
    providers: localProvider
        ? [localProvider]
        : [
              CognitoProvider({
                  clientId: process.env.AUTH_COGNITO_CLIENT_ID as string,
                  clientSecret: process.env.AUTH_COGNITO_CLIENT_SECRET as string,
                  issuer: process.env.AUTH_COGNITO_ISSUER,
              }),
          ],
    debug: process.env.NODE_ENV === 'development' ? true : false,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

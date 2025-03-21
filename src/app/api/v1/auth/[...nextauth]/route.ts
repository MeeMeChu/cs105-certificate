import bcrypt from 'bcrypt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth';

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'example@email.com' },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (
          user &&
          (await bcrypt.compare(password, user.password))
        ) {
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstname,
            lastName: user.lastname,
            role: user.role,
          }
        } else {
          throw new Error('Invalid email or password')
        }
      }
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt' as 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }: { token: any, user?: any }) => {
      if (user) {
        token.id = user.id
        token.firstName = user.firstname
        token.lastName = user.lastname
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }: { session: any, token: any }) => {
      if (session.user) {
        session.user.id = token.id
        session.firstName = token.firstName
        session.lastnName = token.lastName
        session.user.role = token.role
      }
      return session;
    }
  },
};

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
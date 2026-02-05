import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getDataSource } from "@/lib/data-source"
import { User } from "@/entities/User"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const dataSource = await getDataSource();
        const userRepo = dataSource.getRepository(User);

        const user = await userRepo.findOneBy({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
            throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        } as any;
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
        if (token && session.user) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
        }
        return session;
    },
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
            token.role = (user as any).role;
        }
        return token;
    }
  }
}

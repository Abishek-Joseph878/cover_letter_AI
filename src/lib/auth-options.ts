import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Fallback environment variables for Vercel deployments
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "cover_letter_ai_default_nextauth_secret_key_123456789";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();

          // Explicitly select password since it has select: false
          const user = await User.findOne({ email: credentials.email.toLowerCase() }).select("+password");

          if (!user || !user.password) {
            return null;
          }

          const isMatch = await bcrypt.compare(credentials.password, user.password);

          if (!isMatch) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.address = (user as any).address;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        (session.user as any).address = token.address;
        (session.user as any).phone = token.phone;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

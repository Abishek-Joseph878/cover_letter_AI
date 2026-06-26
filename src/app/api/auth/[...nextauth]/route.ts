import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ NextAuth Configuration Error: NEXTAUTH_SECRET environment variable is missing. NextAuth requires this to encrypt cookies/session tokens. Please add it to your .env.local file or your hosting provider's environment variables (e.g. Vercel dashboard).");
}

if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === "production") {
  console.warn("⚠️ NextAuth Configuration Warning: NEXTAUTH_URL environment variable is missing in production. NextAuth requires this to determine redirect URLs. Please set it to your deployment URL (e.g. https://your-domain.vercel.app).");
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


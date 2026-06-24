import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Chatbot } from "@/components/Chatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CoverLetter AI | Land Interviews, Not Rejections",
  description:
    "Generate tailored, professional cover letters that sound human, not AI-generated. ATS-optimized, high-conversion cover letters in seconds.",
  keywords: ["AI", "Cover Letter", "Resume Builder", "Job Application", "ATS Optimization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen">
        <Providers>
          {children}
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}

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
  title: "Covalet | Land Interviews, Not Rejections",
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                  var gradient = localStorage.getItem('gradient') || 'space';
                  document.documentElement.setAttribute('data-gradient', gradient);
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        <Providers>
          {children}
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}

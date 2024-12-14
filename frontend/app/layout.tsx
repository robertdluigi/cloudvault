
import { UserContextProvider } from "@/context/UserContext";
import client from "@/lib/apolloClient"; // Your Apollo client setup
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ApolloWrapper } from "./ApolloWrapper";

// Local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CloudVault",
  description:
    "Secure your data, collaborate with teams, and access your files from anywhere. Join now to start protecting your digital life.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0D1B2A] text-gray-900">
        {/* Wrap everything with both ApolloProvider and UserContextProvider */}
        <UserContextProvider>
        <ApolloWrapper>
            <Header />
            <main>{children}</main>
            <Toaster />
            <Footer />
          </ApolloWrapper>
        </UserContextProvider>
      </body>
    </html>
  );
}

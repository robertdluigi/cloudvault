'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser"; // Assume this is the hook to get user info
import Link from "next/link";

export default function Home() {
  const { user, loading } = useUser(); // Assuming `useUser` gives us the user and loading state
  const [isRedirecting, setIsRedirecting] = useState(true); // State to handle redirection delay
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect if user is logged in
      router.push("/dashboard");
    } else {
      setIsRedirecting(false); // Stop redirecting once user data is available
    }
  }, [user, loading, router]);

  // Show loading state until redirect logic is complete
  if (isRedirecting) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-rows-[1fr_1fr_1fr] items-center justify-items-center min-h-screen bg-[#0D1B2A] p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <main className="flex flex-col gap-8 row-start-2 items-center text-center sm:text-left text-gray-200">
        <h1 className="text-4xl sm:text-5xl font-semibold">
          Welcome to CloudVault
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl text-center">
          Secure your data, collaborate with teams, and access your files from anywhere. Join now to start protecting your digital life.
        </p>
        <div className="flex gap-6 mt-6 justify-center sm:justify-start">
          <Link
            href="/auth/login"
            className="bg-transparent border-2 border-gray-300 text-gray-200 rounded-full px-6 py-3 text-lg font-semibold hover:bg-gray-600 hover:border-gray-500 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="bg-transparent border-2 border-gray-300 text-gray-200 rounded-full px-6 py-3 text-lg font-semibold hover:bg-gray-600 hover:border-gray-500 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}

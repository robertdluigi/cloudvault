'use client';

import { useEffect, useState } from "react";
import Homepage from "@/sections/Homepage";
import { useUser } from "@/hooks/useUser";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser(); // Get user and loading states from context

  // Show loading state until user data is fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is found, show the homepage
  if (!user) {
    return <Homepage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

'use client';
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validateAuth } from "@/lib/auth"; // Import the validateAuth function
import { useUser } from "@/hooks/useUser"; // Hook to get the current user

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // To handle loading state
  const { user } = useUser(); // Get the user data

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await validateAuth(); // Await the validateAuth function to check if the user is authenticated
      } catch (error) {
        // If validation fails (e.g., no token or token is invalid), redirect to login page
        router.push("/auth/login");
        return;
      } finally {
        setLoading(false); // Stop loading once the auth validation is complete
      }
    };

    checkAuth();
  }, [router]);

  // Show a loading state while authentication is being validated
  if (loading) {
    return <div>Loading...</div>; // You can customize this to show a spinner or some other loading UI
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

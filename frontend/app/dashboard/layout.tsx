'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validateAuth } from "@/lib/auth"; // Import the validateAuth function
import Link from "next/link";
import { ReactNode } from "react";
import { useUser } from "@/hooks/useUser";
import FileUpload from "@/components/FileUpload";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // To handle loading state
  const { user, logoutUser } = useUser();
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-4">
        <div className="text-2xl font-bold mb-8">CloudVault</div>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block py-2 px-4 hover:bg-blue-700 rounded">
            Dashboard
          </Link>
          <Link href="/files" className="block py-2 px-4 hover:bg-blue-700 rounded">
            Files
          </Link>
          <Link href="/shared" className="block py-2 px-4 hover:bg-blue-700 rounded">
            Shared
          </Link>
          <Link href="/settings" className="block py-2 px-4 hover:bg-blue-700 rounded">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome back, {user?.first_name}</h1>
          <div className="flex items-center gap-4">
          <FileUpload />
            <div className="relative">
              <button className="text-gray-600 hover:text-gray-800">
                <i className="fas fa-bell"></i>
              </button>
              {/* Notification Badge */}
              <span className="absolute top-0 right-0 text-xs font-semibold text-red-500">3</span>
            </div>
          </div>
        </header>

        {/* Content injected by page.tsx */}
        {children}
      </main>
    </div>
  );
}

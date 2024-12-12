// components/Header.tsx
'use client'
import { useUser } from "@/hooks/useUser"; // Import the hook to check user status
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const { user, loading } = useUser(); // Get user and loading state from the hook

  // Show a loading state while the user data is being fetched
  if (loading) {
    return (
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="text-2xl font-bold tracking-wide">CloudVault</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo Section */}
        <div className="text-2xl font-bold tracking-wide">
          <Link href="/" className="hover:text-gray-200">
            CloudVault
          </Link>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex items-center space-x-6 text-sm font-medium">
            {/* Show different links depending on whether the user is logged in */}
            {!user ? (
              <>
                <li>
                  <Link href="/" className="hover:text-gray-200 transition duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-gray-200 transition duration-200">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-gray-200 transition duration-200">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/dashboard" className="hover:text-gray-200 transition duration-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-gray-200 transition duration-200">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/auth/logout" className="hover:text-gray-200 transition duration-200">
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Theme Toggle */}
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;

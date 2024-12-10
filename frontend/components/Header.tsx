// components/Header.tsx
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
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

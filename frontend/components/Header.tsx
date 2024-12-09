// components/Header.tsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-gray-200">Home</Link>
          </li>
          <li>
            <Link href="/login" className="hover:text-gray-200">Login</Link>
          </li>
          <li>
            <Link href="/signup" className="hover:text-gray-200">Sign Up</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

import Link from "next/link";

export default function Home() {
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

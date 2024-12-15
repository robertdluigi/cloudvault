'use client';
import { useUser } from "@/hooks/useUser";
import UserFiles from "./UserFiles"; // Import UserFiles component

export default function Dashboard() {
  const { user } = useUser(); // Get the user data

  return (
    <div className="flex flex-col items-center justify-start bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Welcome message */}
      <div className="text-center space-y-4 py-8 px-4 sm:px-6 lg:px-8 w-full">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Welcome back, <span className="text-indigo-600">{user?.first_name}</span>
        </h1>
      </div>

      {/* User Files Section */}
      <div className="w-full max-w-4xl mt-8 px-4 sm:px-6 lg:px-8">
        <UserFiles /> {/* Fetch and display the user's files */}
      </div>
    </div>
  );
}

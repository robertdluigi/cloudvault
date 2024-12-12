'use client';
import { useUser } from "@/hooks/useUser";
import UserFiles from "./UserFiles"; // Import UserFiles component

export default function DashboardPage() {
  const { user } = useUser(); // Get the user data

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Welcome back, <span className="text-indigo-600">{user?.first_name}</span>
        </h1>
      </div>

      {/* User Files Section */}
      <UserFiles /> {/* Fetch and display the user's files */}
    </div>
  );
}

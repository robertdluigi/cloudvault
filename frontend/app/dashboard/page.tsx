'use client';
import { useState } from "react";
import { logout } from "@/lib/auth"; // Import the logout function

export default function DashboardPage() {
  const [loading, setLoading] = useState(false); // Optionally handle loading state for other purposes

  const handleLogout = () => {
    // Call the logout function to clear the token and redirect the user to the login page
    logout();
  };

  return (
    <div>
      {/* File Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* File Card 1 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:bg-gray-100 transition-all">
          <div className="text-center">
            <div className="bg-blue-500 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4">
              <i className="fas fa-file-alt text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Documents</h3>
            <p className="text-sm text-gray-500">Total Files: 120</p>
          </div>
        </div>

        {/* File Card 2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:bg-gray-100 transition-all">
          <div className="text-center">
            <div className="bg-green-500 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4">
              <i className="fas fa-image text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Images</h3>
            <p className="text-sm text-gray-500">Total Files: 45</p>
          </div>
        </div>

        {/* File Card 3 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:bg-gray-100 transition-all">
          <div className="text-center">
            <div className="bg-yellow-500 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4">
              <i className="fas fa-video text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Videos</h3>
            <p className="text-sm text-gray-500">Total Files: 30</p>
          </div>
        </div>

        {/* File Card 4 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:bg-gray-100 transition-all">
          <div className="text-center">
            <div className="bg-red-500 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4">
              <i className="fas fa-audio text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Audio</h3>
            <p className="text-sm text-gray-500">Total Files: 10</p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// pages/dashboard.tsx
'use client';
import { useState } from "react";
import { logout } from "@/lib/auth"; // Import the logout function
import FileUpload from "@/components/FileUpload"; // Import FileUpload component
import { useUser } from "@/hooks/useUser";
import FileList from "@/components/FileList"; // Import the FileList component

export default function DashboardPage() {
  const { user } = useUser(); // Get the user data
  
  // Mock files data (this will eventually be replaced with actual data from the backend)
  const mockFiles = [
    { fileId: "1", fileName: "Document 1", fileType: "pdf", fileSize: 1500000 },
    { fileId: "2", fileName: "Image 1", fileType: "image", fileSize: 2300000 },
    { fileId: "3", fileName: "Video 1", fileType: "video", fileSize: 50000000 },
    { fileId: "4", fileName: "Audio 1", fileType: "audio", fileSize: 3500000 },
  ];

  const handleLogout = () => {
    // Call the logout function to clear the token and redirect the user to the login page
    logout();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Welcome back, {user?.first_name}
        </h1>
        <FileUpload /> {/* File upload button */}
      </div>

      {/* File List */}
      <FileList files={mockFiles} /> {/* Pass mockFiles as prop to FileList */}
    </div>
  );
}

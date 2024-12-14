'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import FileList from "@/components/FileList";
import { useUser } from "@/hooks/useUser";
import FileUpload from "@/components/FileUpload";

type File = {
  id: string;
  user_id: string;
  access_key: string;
  file_type: string;
  file_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
  updated_at: string;
};

const UserFiles: React.FC = () => {
  const [files, setFiles] = useState<File[] | null>(null); // Initializing as null
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { user } = useUser();

  useEffect(() => {
    if (user?.user_id) {
      axios
        .get(`/api/v1/files/${user.user_id}`)
        .then((response) => {
          setFiles(response.data); // Set files to response data
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch files.");
          setLoading(false);
        });
    }
  }, [user]);

  const handleFileUploaded = (newFile: File | null) => {
    if (newFile) {
      setFiles((prevFiles) => [newFile, ...(prevFiles || [])]); // Default prevFiles to empty array if null
    }
  };

  const handleFileDelete = (fileId: string) => {
    // Remove the deleted file from the list
    setFiles((prevFiles) => prevFiles?.filter(file => file.id !== fileId) || null);
  };

  // Loading or error state
  if (loading) return <p className="text-center text-xl font-semibold">Loading files...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-6">
        {/* Upload button */}
        <div className="w-full flex justify-center">
          <FileUpload onFileUploaded={handleFileUploaded} />
        </div>

        {/* Files list */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center">Your Files</h2>
          <div className="overflow-hidden">
            {(files === null || files.length === 0) ? (
              <p className="text-center text-gray-500 p-4">No files uploaded yet.</p>
            ) : (
              <FileList files={files} onFileDelete={handleFileDelete} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFiles;

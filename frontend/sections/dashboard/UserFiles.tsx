"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/hooks/useUser";
import FileList from "@/components/FileList";
import FileUpload from "@/components/FileUpload";
import { config } from "@/lib/config";

type File = {
  id: string;
  filename: string;
  mimetype: string;
  encoding: string;
  filesize: number;
  url: string;
  user_id: string;
  created_at: string;
};

const UserFiles: React.FC = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { user } = useUser(); // User context

  const fetchFiles = async () => {
    if (!user?.id) return; // Early return if no user ID

    const query = `
      query GetUserFiles($id: ID!) {
        userFiles(id: $id) {
          id
          filename
          url
          mimetype
          encoding
          filesize
          createdAt
        }
      }
    `;

    try {
      setLoading(true);
      const response = await axios.post(
        `${config.API_BASE_URL}/query`, // Make sure to replace with your API endpoint
        {
          query,
          variables: { id: user.id }, // Pass the user ID as a variable
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const userFiles = response.data?.data?.userFiles || [];
      setFiles(userFiles);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to fetch files. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    const mutation = `
      mutation DeleteFile($id: ID!) {
        deleteFile(id: $id)
      }
    `;

    try {
      await axios.post(
        `${config.API_BASE_URL}/query`,
        {
          query: mutation,
          variables: { id: fileId },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setFiles((prevFiles) => prevFiles?.filter((file) => file.id !== fileId) || null);
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file. Please try again.");
    }
  };

  const handleFileUploaded = (newFile: File | null) => {
    if (newFile) {
      setFiles((prevFiles) => [newFile, ...(prevFiles || [])]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [user]);

  if (loading) return <p className="text-center text-xl font-semibold">Loading files...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <FileUpload onFileUploaded={handleFileUploaded} />
      <div className="flex flex-col items-center gap-6">
        <div className="w-full flex justify-center"></div>

        <div className="w-full flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center">Your Files</h2>
          <div className="overflow-hidden">
            {files === null || files.length === 0 ? (
              <p className="text-center text-gray-500 p-4">No files uploaded yet.</p>
            ) : (
              <FileList files={files} onFileDelete={deleteFile} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFiles;

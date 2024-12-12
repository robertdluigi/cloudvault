import React from "react";
import File from "./File"; // Import the File component

interface FileData {
  id: string;
  user_id: string;
  access_key: string;
  file_type: string;
  file_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

interface FileListProps {
  files: FileData[] | null; // Allow files to be null
}

const FileList = ({ files }: FileListProps) => {
  if (!files || files.length === 0) {
    return <p>No files available.</p>; // Show message if files is null or empty
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <File key={file.id} fileData={file} />
      ))}
    </div>
  );
};

export default FileList;

import React from "react";
import File from "./File"; // Import the File component

interface FileData {
  id: string;
  filename: string;
  mimetype: string;
  encoding: string;
  filesize: number;
  url: string;
  user_id: string;
  created_at: string;
}

interface FileListProps {
  files: FileData[] | null; // Allow files to be null
  onFileDelete: (fileId: string) => void; // Pass onFileDelete function
}

const FileList = ({ files, onFileDelete }: FileListProps) => {
  if (!files || files.length === 0) {
    return <p>No files available.</p>; // Show message if files is null or empty
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <File key={file.id} fileData={file} onDelete={onFileDelete} />
      ))}
    </div>
  );
};

export default FileList;

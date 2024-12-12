// components/File.tsx
import { File as FileIcon, FileText, Image, Music, Video } from "lucide-react"; // Import icons from lucide-react
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { useState } from "react";
import React from "react";

interface FileProps {
  fileData: {
    fileType: string;
    fileName: string;
    fileSize: number;
    fileId: string;
  };
}

const File = ({ fileData }: FileProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // Helper function to format file size in a readable way
  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    else if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
    else if (size < 1073741824) return `${(size / 1048576).toFixed(1)} MB`;
    else return `${(size / 1073741824).toFixed(1)} GB`;
  };

  // Helper function to render icons based on file type
  const renderIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image />;
      case "audio":
        return <Music />;
      case "video":
        return <Video />;
      case "text":
        return <FileText />;
      default:
        return <FileIcon />;
    }
  };

  // Actions (for now, just log actions)
  const handleDownload = () => {
    console.log("Download clicked");
    // Implement download logic here
  };

  const handleDelete = () => {
    console.log("Delete clicked");
    // Implement delete logic here
  };

  const handleShare = () => {
    console.log("Share clicked");
    // Implement share logic here
  };

  return (
    <div
      className={`relative flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-lg shadow-md transition-colors ${
        isFocused ? "border-2 border-blue-500" : ""
      }`}
      onClick={() => setIsFocused(!isFocused)}
    >
      {/* Left section - File Icon and Name */}
      <div className="flex items-center space-x-4">
        <div className="text-xl text-white">
          {renderIcon(fileData.fileType)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-300 truncate">{fileData.fileName}</span>
          <span className="text-xs text-gray-500">{formatFileSize(fileData.fileSize)}</span>
        </div>
      </div>

      {/* Three dots (actions) menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="text-gray-400 hover:text-white cursor-pointer">
          <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-xs">...</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 text-white rounded-lg shadow-lg">
          <DropdownMenuItem onClick={handleDownload}>Download</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>Share</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default File;

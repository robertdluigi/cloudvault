'use client';
import { File as FileIcon, FileText, Image, Music, Video, MoreHorizontal, Download, Trash, Share } from "lucide-react"; // Import icons from lucide-react
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { useState } from "react";
import React from "react";

interface FileProps {
  fileData: {
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
          {renderIcon(fileData.file_type)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-300 truncate">{fileData.file_name}</span>
          <span className="text-xs text-gray-500">{formatFileSize(fileData.file_size)}</span>
        </div>
      </div>

      {/* More Horizontal Icon and Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="text-gray-200 hover:text-white cursor-pointer">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <MoreHorizontal size={32} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 text-white rounded-lg shadow-lg">
          <DropdownMenuItem onClick={handleDownload} className="flex items-center space-x-2">
            <Download size={16} />
            <span>Download</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="flex items-center space-x-2">
            <Trash size={16} />
            <span>Delete</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare} className="flex items-center space-x-2">
            <Share size={16} />
            <span>Share</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default File;

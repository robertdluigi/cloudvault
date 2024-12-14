'use client';
import { File as FileIcon, FileText, Image, Music, Video, MoreHorizontal, Download, Trash, Share } from "lucide-react"; // Import icons from lucide-react
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle } from "./ui/dialog"; // ShadCN Dialog components
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/lib/config";


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
  onDelete: (fileId: string) => void; // Receive onDelete function from parent
}

const File = ({ fileData, onDelete  }: FileProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // State to manage the share modal visibility
  const { toast } = useToast(); // Hook to show toast messages

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

  // Handle delete logic
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/v1/files/delete/${fileData.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      onDelete(fileData.id); // Call onDelete to update the parent state
      toast({
        title: "Success",
        description: "File deleted successfully",
        variant: "default", // This is the default variant for success
      });
      
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again later.",
        variant: "destructive", // This variant is for error messages
      });
    }
  };

  // Handle share logic - Open modal with link
  const handleShare = () => {
    setIsShareModalOpen(true); // Open the share modal
  };

  // Handle focus logic - Disable when modal is open
  const handleFocus = () => {
    if (!isShareModalOpen) {
      setIsFocused(!isFocused); // Only toggle focus when modal is not open
    }
  };

  return (
    <div
      className={`relative flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-lg shadow-md transition-colors ${
        isFocused ? "border-2 border-blue-500" : ""
      }`}
      onClick={handleFocus}
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

      {/* Share Modal using ShadCN Dialog */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogTrigger className="hidden" /> {/* You can trigger the dialog from anywhere */}
        <DialogContent className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <DialogTitle className="text-white mb-4 text-lg">Share File</DialogTitle> {/* Hidden title for accessibility */}
          <p className="text-sm text-gray-300 mb-2">Copy the link below to share this file:</p>
          <input
            type="text"
            readOnly
            value={`localhost:3000/file/${fileData.access_key}`}
            className="w-full p-2 text-gray-700 bg-gray-200 rounded-md mb-4"
          />
          <DialogClose
            onClick={() => setIsShareModalOpen(false)} // Close modal on click
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
          >
            Close
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default File;

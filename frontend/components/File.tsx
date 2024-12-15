'use client';
import { File as FileIcon, FileText, Image, Music, Video, MoreHorizontal, Trash, Share } from "lucide-react"; 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle } from "./ui/dialog"; 
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import React from "react";

interface FileProps {
  fileData: {
    id: string;
    filename: string;
    mimetype: string;
    encoding: string;
    filesize: number;
    url: string;
    user_id: string;
    created_at: string;
  };
  onDelete: (fileId: string) => void;
}

const File = ({ fileData, onDelete }: FileProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    else if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
    else if (size < 1073741824) return `${(size / 1048576).toFixed(1)} MB`;
    else return `${(size / 1073741824).toFixed(1)} GB`;
  };

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

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/v1/files/delete/${fileData.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      onDelete(fileData.id);
      toast({
        title: "Success",
        description: "File deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleFocus = () => {
    if (!isShareModalOpen) {
      setIsFocused(!isFocused);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-lg shadow-md transition-colors dark:bg-gray-900 dark:hover:bg-gray-800 ${
        isFocused ? "border-2 border-blue-500" : ""
      }`}
      onClick={handleFocus}
    >
      <div className="flex items-center space-x-4">
        <div className="text-xl text-white dark:text-gray-200">
          {renderIcon(fileData.mimetype)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-300 truncate dark:text-gray-100">{fileData.filename}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(fileData.filesize)}</span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="text-gray-200 hover:text-white cursor-pointer dark:text-gray-300 dark:hover:text-gray-100">
          <div className="w-6 h-6 text-gray-400">
            <MoreHorizontal />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-36">
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="w-4 h-4 mr-2" /> Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <Share className="w-4 h-4 mr-2" /> Share
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default File;

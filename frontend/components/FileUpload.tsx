import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress"; // Import Progress component

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/v1/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 0;
          const percentCompleted = Math.round((progressEvent.loaded / total) * 100);
          setUploadProgress(percentCompleted);
        },
      });
      setUploadStatus(response.data.message);
    } catch (error: any) {
      setUploadStatus("Upload failed");
      console.error(error);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Upload File</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload a File</DialogTitle>
          </DialogHeader>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg border-gray-300 bg-gray-100 p-4"
          >
            {file ? (
              <p className="text-center">{file.name}</p>
            ) : (
              <p className="text-center text-gray-500">Drag and drop a file here, or click to browse</p>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="mt-4 text-blue-600 underline cursor-pointer">
              Browse files
            </label>
          </div>
          {uploadProgress > 0 && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="mt-2 text-center text-sm text-gray-600">{uploadProgress}%</p>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button onClick={handleUpload}>Upload</Button>
          </div>
          {uploadStatus && <p className="mt-4 text-center text-gray-600">{uploadStatus}</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUpload;

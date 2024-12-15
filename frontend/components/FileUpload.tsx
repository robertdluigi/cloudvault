'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { config } from '@/lib/config';

interface FileUploadProps {
  onFileUploaded: (file: any) => void;
}

const FileUpload = ({ onFileUploaded }: FileUploadProps) => {
  const { user } = useUser(); // Assuming `user` is the logged-in user object
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setError(null); // Reset error on file change
      setSuccess(null); // Reset success message on new file selection
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      toast({ title: 'No file selected', variant: 'destructive' });
      return;
    }

    if (!user || !user.id) {
      toast({ title: 'You must be logged in to upload a file', variant: 'destructive' });
      return;
    }

    const formData = new FormData();
    formData.append('operations', JSON.stringify({
      query: `mutation UploadFile($file: Upload!, $userId: String!) {
        uploadFile(file: $file, userId: $userId) {
          id
          filename
          mimetype
          encoding
          filesize
          url
          createdAt
          user {
            id
          }
        }
      }`,
      variables: { file: file, userId: user.id },
    }));
    formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
    formData.append('0', file);

    setUploading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/query`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data?.data?.uploadFile) {
        const uploadedFile = response.data.data.uploadFile;
        // Update parent with the uploaded file
        onFileUploaded(uploadedFile);
        setSuccess('File uploaded successfully');
        toast({
          title: 'Upload successful!',
          description: 'Your file has been uploaded.',
          variant: 'default',
        });
      } else {
        setError('Unexpected response structure: uploadFile not found');
        toast({
          title: 'Upload failed',
          description: 'The server response was unexpected.',
          variant: 'destructive',
        });
        onFileUploaded(null); // Remove optimistic file on failure
      }
    } catch (err: any) {
      console.error(err);
      setError('There was an error uploading your file.');
      toast({
        title: 'Upload failed',
        description: err?.response?.data?.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
      onFileUploaded(null); // Remove optimistic file on error
    } finally {
      setUploading(false);
    }

    // Reset dialog and states after upload
    setFile(null);
    setProgress(0);
    setError(null);
    setSuccess(null);
    setDialogOpen(false); // Close dialog after upload
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setDialogOpen(true)}>
            Upload File
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Upload a File</DialogTitle>
          </DialogHeader>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-700 p-4"
          >
            {file ? (
              <p className="text-center text-sm text-gray-800 dark:text-gray-200">{file.name}</p>
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Drag and drop a file here, or click to browse
              </p>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="mt-4 text-blue-600 dark:text-blue-400 underline cursor-pointer">
              Browse files
            </label>
          </div>

          {uploading && (
            <div className="mt-4">
              <Progress value={progress} className="w-full bg-blue-200 dark:bg-blue-500" />
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">{progress}%</p>
            </div>
          )}

          {error && <p className="text-red-600 mt-2">{error}</p>}
          {success && <p className="text-green-600 mt-2">{success}</p>}

          <div className="mt-4 flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={uploading || !file} 
              className={`bg-blue-600 text-white hover:bg-blue-700 ${uploading || !file ? 'opacity-50' : ''}`}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUpload;

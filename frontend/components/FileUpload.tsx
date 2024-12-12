'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import FileList from '@/components/FileList';

const FileUpload = ({ onFileUploaded }: { onFileUploaded: (file: any) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

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
      toast({ title: 'No file selected', variant: 'destructive' });
      return;
    }

    if (!user || !user.user_id) {
      toast({ title: 'User ID is required', variant: 'destructive' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user?.user_id);

    setUploading(true);
    setError(null);
    setProgress(0);

    // Optimistically add the file to the list of files
    const optimisticFile = {
      id: Date.now().toString(),
      user_id: user.user_id,
      file_type: file.type,
      file_name: file.name,
      file_size: file.size,
      file_url: URL.createObjectURL(file), // Use a temporary URL
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    onFileUploaded(optimisticFile); // Optimistically update parent component

    try {
      const response = await axios.post('/api/v1/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((100 * event.loaded) / event.total));
          }
        },
      });

      // On success, update the file URL with the server's response
      optimisticFile.file_url = response.data.file_url;
      toast({
        title: 'File uploaded successfully!',
        description: 'Your file was uploaded successfully.',
        variant: 'default',
      });
      setDialogOpen(false);
      setFile(null);
    } catch (err) {
      setError('There was an error uploading your file.');
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file.',
        variant: 'destructive',
      });
      // If upload fails, remove the optimistic file
      onFileUploaded(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setDialogOpen(true)}>Upload File</Button>
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

          {uploading && (
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="mt-2 text-center text-sm text-gray-600">{progress}%</p>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button onClick={handleUpload}>Upload</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUpload;

// src/store/uploadStore.ts
import { create } from 'zustand';

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  startUpload: () => void;
  setProgress: (progress: number) => void;
  setError: (error: string) => void;
  setSuccess: () => void;
}

export const useUploadStore = create<UploadState>((set: any) => ({
  uploading: false,
  progress: 0,
  error: null,
  success: false,
  startUpload: () => set({ uploading: true, progress: 0, error: null, success: false }),
  setProgress: (progress: any) => set({ progress }),
  setError: (error: any) => set({ error, uploading: false }),
  setSuccess: () => set({ success: true, uploading: false }),
}));

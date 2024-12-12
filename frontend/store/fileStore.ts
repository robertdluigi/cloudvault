// src/store/fileStore.ts
import { create } from 'zustand';
import axios from 'axios';

type File = {
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

interface FileState {
  files: File[];
  loading: boolean;
  error: string | null;
  fetchFiles: (userId: string) => Promise<void>;
  addFile: (file: File) => void; // New action to add a file
}

export const useFileStore = create<FileState>((set) => ({
  files: [],
  loading: false,
  error: null,
  fetchFiles: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`/api/v1/files/${userId}`);
      set({ files: data, loading: false });
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to fetch files';
      set({ error: errorMessage, loading: false });
    }
  },
  addFile: (file) => {
    set((state) => ({
      files: [file, ...state.files], // Add new file at the start of the list
    }));
  },
}));

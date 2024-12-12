// components/FileList.tsx
import File from "./File"; // Import the File component

interface FileData {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface FileListProps {
  files: FileData[];
}

const FileList = ({ files }: FileListProps) => {
  return (
    <div className="space-y-4">
      {files.map((file) => (
        <File key={file.fileId} fileData={file} />
      ))}
    </div>
  );
};

export default FileList;

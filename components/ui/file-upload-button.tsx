// file-upload-button.tsx
import React, { useState } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import { UploadFile as UploadIcon } from '@mui/icons-material';

interface FileUploadButtonProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ handleFileUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    try {
      await handleFileUpload(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Tooltip title="Upload data file">
      <label>
        <input
          type="file"
          accept=".txt,.csv"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        <IconButton component="span" disabled={uploading}>
          {uploading ? <CircularProgress size={24} /> : <UploadIcon />}
        </IconButton>
      </label>
    </Tooltip>
  );
};

export default FileUploadButton;
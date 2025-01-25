import React from 'react';
import { IconButton } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

interface UploadProp {
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>)=>void;
}
const FileUploadButton = ({handleFileUpload}:UploadProp) => {
  
  // Create a reference to the hidden file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Trigger the file input click event
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        accept=".csv, .txt" // Specify accepted file types
      />

      {/* IconButton to trigger file input */}
      <IconButton onClick={handleClick}>
        <UploadIcon />
      </IconButton>
    </div>
  );
};

export default FileUploadButton;
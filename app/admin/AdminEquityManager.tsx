import { useState } from 'react';
import { useEquity } from '@/context/EquityContext';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { uploadPDF } from '@/utils/api';

export const AdminEquityManager = () => {
  const { equityPercentage, refreshEquity } = useEquity();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: uploadStatus === 'loading',
    onDrop: async (files) => {
      if (files.length > 0) {
        await handlePdfUpload(files[0]);
      }
    },
  });

  const handlePdfUpload = async (file: File) => {
    // if (!session?.user?.isAdmin) {
    //   setErrorMessage('Unauthorized access');
    //   return;
    // }

    setUploadStatus('loading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      uploadPDF(formData);

      await refreshEquity();
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2000);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Failed to process PDF');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Equity Percentage</h2>
        <div className="text-3xl text-blue-600">
          {equityPercentage || 'N/A'}
        </div>
      </div>

      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${uploadStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          {uploadStatus === 'loading' ? (
            <p className="text-gray-600">Processing PDF...</p>
          ) : uploadStatus === 'success' ? (
            <p className="text-green-600">Upload successful!</p>
          ) : (
            <>
              <p className="text-lg mb-2">
                {isDragActive ? 'Drop PDF here' : 'Drag & drop statement PDF'}
              </p>
              <p className="text-sm text-gray-500">
                Supported format: .pdf (Robinhood account statement)
              </p>
            </>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
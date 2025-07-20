'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, FileIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadZoneProps {
  label: string;
  onUpload: (file: File) => void;
  uploadedFile?: File | null;
  onRemove?: () => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  onUpload,
  uploadedFile,
  onRemove
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return <FileText className="w-8 h-8 text-red-400" />;
    }
    if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
      return <FileIcon className="w-8 h-8 text-blue-400" />;
    }
    return <FileText className="w-8 h-8 text-gray-400" />;
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4 text-white">{label}</h3>

      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`
            relative overflow-hidden rounded-2xl p-8 text-center cursor-pointer 
            transition-all duration-300 backdrop-blur-sm border-2 border-dashed
            hover:scale-[1.02] active:scale-[0.98]
            ${isDragActive 
              ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/25' 
              : 'border-white/30 bg-white/10 hover:bg-white/15 hover:border-white/50'
            }
          `}
        >
          <input {...getInputProps()} />
          
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-50"></div>
          
          <div className="relative z-10">
            <motion.div
              animate={{ 
                y: isDragActive ? -5 : 0,
                scale: isDragActive ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
              className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center
                ${isDragActive 
                  ? 'bg-blue-500 shadow-lg shadow-blue-500/30' 
                  : 'bg-white/20 backdrop-blur-sm'
                }`}
            >
              <Upload className={`w-8 h-8 ${isDragActive ? 'text-white' : 'text-blue-200'}`} />
            </motion.div>
            
            <p className={`text-lg font-medium mb-2 transition-colors
              ${isDragActive ? 'text-blue-100' : 'text-white'}`}>
              {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
            </p>
            
            <p className="text-blue-200/70 mb-4">
              or click to browse from your computer
            </p>
            
            <div className="inline-flex items-center space-x-4 text-sm text-blue-200/60">
              <span>PDF</span>
              <div className="w-1 h-1 bg-blue-200/40 rounded-full"></div>
              <span>JPG</span>
              <div className="w-1 h-1 bg-blue-200/40 rounded-full"></div>
              <span>PNG</span>
              <div className="w-1 h-1 bg-blue-200/40 rounded-full"></div>
              <span>Max 50MB</span>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl p-6 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg"
        >
          {/* Success gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-green-600/20 opacity-50"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* File icon with success indicator */}
              <div className="relative">
                {getFileIcon(uploadedFile.name)}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div>
                <p className="font-semibold text-white text-lg">{uploadedFile.name}</p>
                <p className="text-blue-200/70 text-sm">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded successfully
                </p>
              </div>
            </div>
            
            {onRemove && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRemove}
                className="p-2 bg-white/10 hover:bg-red-500/20 rounded-full transition-colors backdrop-blur-sm border border-white/20 hover:border-red-400/40"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </div>
          
          {/* Progress bar animation */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500"
          ></motion.div>
        </motion.div>
      )}
    </div>
  );
};
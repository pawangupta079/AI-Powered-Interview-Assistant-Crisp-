import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';
import './FileUpload.css';

const FileUpload = ({ onFileUpload, onSkipDemo, isLoading, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = (file) => {
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!validTypes.includes(file.type)) {
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') {
      return <FileText className="file-icon pdf" />;
    }
    return <FileText className="file-icon doc" />;
  };

  if (isLoading) {
    return (
      <div className="file-upload-container">
        <div className="upload-loading">
          <LoadingSpinner size="large" message="Processing your resume..." />
        </div>
      </div>
    );
  }

  return (
    <div className="file-upload-container">
      <div className="upload-header">
        <h2>Upload Your Resume</h2>
        <p>Upload your resume in PDF or DOCX format to get started</p>
      </div>

      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${error ? 'error' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileSelector}
        role="button"
        tabIndex={0}
        aria-label="Upload resume file"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="file-input"
          accept=".pdf,.docx,.doc"
          onChange={handleFileInputChange}
          aria-label="Resume file input"
        />

        {!selectedFile ? (
          <>
            <div className="upload-icon">
              <Upload size={48} />
            </div>
            <div className="upload-text">
              <h3>Drop your resume here</h3>
              <p>or click to browse files</p>
              <span className="file-types">
                Supported formats: PDF, DOCX (Max 10MB)
              </span>
            </div>
          </>
        ) : (
          <div className="selected-file">
            <div className="file-info">
              {getFileIcon(selectedFile.type)}
              <div className="file-details">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="remove-file-btn"
              aria-label="Remove selected file"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="upload-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="upload-actions">
        {selectedFile && (
          <button
            onClick={handleUpload}
            className="btn btn-primary btn-lg"
            disabled={isLoading}
          >
            <CheckCircle size={20} />
            Process Resume
          </button>
        )}

        {onSkipDemo && (
          <button
            onClick={onSkipDemo}
            className="btn btn-secondary btn-lg"
            disabled={isLoading}
          >
            Skip & Use Demo Data
          </button>
        )}
      </div>

      <div className="upload-tips">
        <h4>Tips for best results:</h4>
        <ul>
          <li>Use a well-formatted resume with clear sections</li>
          <li>Ensure your name, email, and phone number are clearly visible</li>
          <li>PDF format generally provides better text extraction</li>
          <li>Keep file size under 10MB for faster processing</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;

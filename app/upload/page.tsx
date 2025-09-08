"use client";

import { useState } from 'react';
import axios from 'axios';
import React from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      const data = response.data;

      setMessage(`File uploaded successfully! URL: ${data.url}`);
    } catch (error) {
      setMessage('An error occurred while uploading the file.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">File Upload</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="file" className="sr-only">File</label>
            <input id="file" type="file" onChange={handleFileChange} className="input-field" />
          </div>
          <button type="submit" className="w-full btn-gradient">Upload</button>
        </form>
        {progress > 0 && (
          <div className="w-full bg-muted rounded-full h-2 mt-4">
            <div className="bg-accent-blue h-2 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        )}
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}

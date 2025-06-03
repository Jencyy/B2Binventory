// src/components/ExcelUpload.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography } from '@mui/material';

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

 // ExcelUpload.jsx
 const handleUpload = async () => {
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file); // ✅ Must match backend multer field

  try {
    setUploading(true);
    const res = await axios.post('/api/products/admin/upload-products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setMessage(res.data.message || 'Upload successful!');
    // dispatch(fetchProducts()); // Uncomment only if you're using Redux to refresh products
  } catch (err) {
    console.error(err.response?.data || err.message);
    setMessage('Upload failed. Please try again.');
  } finally {
    setUploading(false);
  }
};



  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <Typography variant="h6">Upload Products via Excel</Typography>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload} disabled={uploading} style={{ marginTop: '10px' }}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
      {message && <Typography style={{ marginTop: '10px' }}>{message}</Typography>}
    </div>
  );
};

export default ExcelUpload;

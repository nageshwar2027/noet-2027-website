import React, { useState, useEffect } from 'react';
import './AbstractModal.css';
import { API_BASE_URL, warmupBackend } from '../config.js';

const AbstractModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: ''
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      warmupBackend();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!file) {
      setStatus('Please upload an abstract document.');
      return;
    }

    setIsSubmitting(true);
    setStatus('Preparing and uploading abstract document...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    // Progressive status updates for slower cloud backend wake-ups & storage uploads
    const stage1Timer = setTimeout(() => {
      setStatus('Connecting to cloud server (instance waking up, please wait)...');
    }, 4000);
    const stage2Timer = setTimeout(() => {
      setStatus('Uploading document to cloud storage (this may take a few moments)...');
    }, 12000);
    const stage3Timer = setTimeout(() => {
      setStatus('Finalizing submission with server...');
    }, 25000);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('institution', formData.institution);
    submitData.append('document', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/submit-abstract/`, {
        method: 'POST',
        body: submitData,
        signal: controller.signal,
      });

      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(stage3Timer);
      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus('Abstract submitted successfully!');
        setFormData({ name: '', email: '', institution: '' });
        setFile(null);
        setTimeout(() => {
          onClose();
          setStatus('');
        }, 2000);
      } else {
        let errorMsg = 'Submission failed. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMsg = errorData.error;
          } else if (errorData && typeof errorData === 'object') {
            const firstKey = Object.keys(errorData)[0];
            const val = errorData[firstKey];
            if (Array.isArray(val) && val.length > 0) {
              errorMsg = `${firstKey.replace('_', ' ')}: ${val[0]}`;
            } else if (typeof val === 'string') {
              errorMsg = val;
            }
          }
        } catch (_) {}
        setStatus(errorMsg);
      }
    } catch (err) {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(stage3Timer);
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        setStatus('Request timed out while uploading. Please check your internet connection or file size and try again.');
      } else {
        setStatus('Error connecting to the server. Please check your internet connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <h2>Submit Your Abstract</h2>
          <p className="modal-subtitle">Please read the guidelines and use the official template.</p>
        </div>

        <div className="template-buttons">
          <a href="/extras/N0ET27_Abstract_Template (1).docx" download className="btn-template">
            📄 Template
          </a>
          <a href="/extras/N0ET27_Full_Paper_Guidelines-1.docx" download className="btn-template">
            📋 Guidelines
          </a>
        </div>

        <form onSubmit={handleSubmit} className="abstract-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label htmlFor="institution">Institution / Organization</label>
            <input type="text" id="institution" name="institution" value={formData.institution} onChange={handleChange} />
          </div>
          
          <div className="form-group file-upload-group">
            <label htmlFor="document">Upload Abstract (PDF/DOCX) *</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                id="document" 
                name="document" 
                accept=".pdf,.doc,.docx" 
                required 
                onChange={handleFileChange}
              />
              <div className="file-input-label">
                {file ? (
                  <>
                    <span className="file-icon">✓</span>
                    <span className="file-name">{file.name}</span>
                  </>
                ) : (
                  <>
                    <span className="file-icon">↑</span>
                    <span>Click to upload or drag and drop</span>
                    <span className="file-hint">PDF, DOC, DOCX (Max 10MB)</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading & Submitting...' : 'Submit Abstract'}
          </button>
          {status && <p className="status-msg">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default AbstractModal;

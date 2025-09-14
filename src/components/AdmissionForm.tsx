'use client';
import React, { useState } from 'react';

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    class: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Form submitted successfully!');
        setFormData({
          studentName: '',
          parentName: '',
          email: '',
          class: '',
          message: '',
        });
      } else {
        setStatus('An error occurred. Please try again.');
      }
    } catch (error) {
      setStatus('An error occurred. Please try again.');
    }
  };

  const isSubmitDisabled = !formData.studentName || !formData.parentName || !formData.email || !formData.class;

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-3">Admission Form</h3>
      <div className="mb-3">
        <label htmlFor="studentName" className="form-label">
          Student's Name <span style={{ color: 'red' }}>*</span>
        </label>
        <input type="text" className="form-control" id="studentName" value={formData.studentName} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="parentName" className="form-label">
          Parent's Name <span style={{ color: 'red' }}>*</span>
        </label>
        <input type="text" className="form-control" id="parentName" value={formData.parentName} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email Address <span style={{ color: 'red' }}>*</span>
        </label>
        <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="class" className="form-label">
          Class <span style={{ color: 'red' }}>*</span>
        </label>
        <input type="text" className="form-control" id="class" value={formData.class} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea className="form-control" id="message" rows={3} value={formData.message} onChange={handleChange}></textarea>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-primary" disabled={isSubmitDisabled}>
          Submit
        </button>
      </div>
      {status && <p style={{ color: 'red' }}>{status}</p>}
    </form>
  );
};

export default AdmissionForm;

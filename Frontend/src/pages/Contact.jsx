import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
      setSuccess('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Contact Us</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem',
        '@media (maxWidth: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        {/* Contact Information */}
        <div>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>Get in Touch</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Have questions or need assistance? We're here to help! Reach out to us through any of the following methods:
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>Contact Information</h3>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              <strong>Email:</strong> info@travelexplorer.com
            </p>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              <strong>Address:</strong> 123 Travel Street, Adventure City, AC 12345
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>Business Hours</h3>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              Monday - Friday: 9:00 AM - 6:00 PM
            </p>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              Saturday: 10:00 AM - 4:00 PM
            </p>
            <p style={{ color: '#666' }}>
              Sunday: Closed
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>Send us a Message</h2>
          
          {error && (
            <div style={{ 
              color: 'red', 
              backgroundColor: '#ffebee',
              padding: '0.5rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ 
              color: 'green', 
              backgroundColor: '#e8f5e9',
              padding: '0.5rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Subject:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minHeight: '150px'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact; 
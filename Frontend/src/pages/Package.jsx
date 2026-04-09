import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Package = () => {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    destinations: [],  
    image: ''
  });

  useEffect(() => {
    fetchPackages();
    fetchDestinations();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/packages`);
      setPackages(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch packages');
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/destinations`);
      setDestinations(response.data);
    } catch (err) {
      setError('Failed to fetch destinations');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDestinationChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      destinations: selectedOptions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Convert image string to array if needed
      const packageData = {
        ...formData,
        images: [formData.image] // Convert single image URL to array as per schema
      };

      if (editingPackage) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/packages`,
          { 
            ...packageData, 
            packageId: editingPackage._id,
            destinations: formData.destinations // Always send destinations array, even if empty
          },
          { headers }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/packages`,
          packageData,
          { headers }
        );
      }
      setShowForm(false);
      setEditingPackage(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        destinations: [],
        image: ''
      });
      fetchPackages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save package');
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    
    // Extract destination IDs from the package
    const destinationIds = pkg.destinations.map(dest => dest._id || dest);
    
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      destinations: destinationIds,
      image: pkg.images?.[0] || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/packages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: { packageId: id }
        });
        fetchPackages();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete package');
      }
    }
  };

  const handleBookPackage = (packageId) => {
    navigate(`/bookings/new?package=${packageId}`);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading packages...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#333' }}>Travel Packages</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingPackage(null);
              setFormData({
                name: '',
                description: '',
                price: '',
                duration: '',
                destinations: [],
                image: ''
              });
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add New Package
          </button>
        )}
      </div>

      {showForm && user?.role === 'admin' && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '2rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>
            {editingPackage ? 'Edit Package' : 'Add New Package'}
          </h2>
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
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minHeight: '100px'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
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

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Duration (days):</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
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
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Destinations:</label>
              <select
                multiple
                name="destinations"
                value={formData.destinations}
                onChange={handleDestinationChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minHeight: '100px'
                }}
              >
                {destinations.map(dest => (
                  <option key={dest._id} value={dest._id}>
                    {dest.name} - {dest.location}
                  </option>
                ))}
              </select>
              <small style={{ display: 'block', marginTop: '0.25rem', color: '#666' }}>
                Hold Ctrl (or Cmd on Mac) to select multiple destinations
              </small>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Image URL:</label>
              <input
                type="text"
                name="image"
                value={formData.image}
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

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {editingPackage ? 'Update Package' : 'Add Package'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingPackage(null);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '2rem' 
      }}>
        {packages.map((pkg) => (
          <div 
            key={pkg._id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s'
            }}
          >
            <img 
              src={pkg.images?.[0] || 'https://via.placeholder.com/300x200'} 
              alt={pkg.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
            />
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '0.5rem', color: '#333' }}>{pkg.name}</h2>
              <p style={{ color: '#666', marginBottom: '1rem' }}>{pkg.description}</p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold',
                  color: '#007bff'
                }}>
                  ₹{pkg.price}
                </span>
                <span style={{ color: '#666' }}>
                  {pkg.duration} days
                </span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#333' }}>Destinations:</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {pkg.destinations && pkg.destinations.map((dest, index) => (
                    <li key={index} style={{ color: '#666', marginBottom: '0.25rem' }}>
                      • {dest.name || dest}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {user?.role === 'admin' ? (
                  <>
                    <button
                      onClick={() => handleEdit(pkg)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#ffc107',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleBookPackage(pkg._id)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Package;
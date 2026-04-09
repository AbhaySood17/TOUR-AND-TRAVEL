import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    price: '',
    category: '',
    rating: '',
    images: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop'
  });

  useEffect(() => {
    console.log('Current user:', user);
    console.log('User role:', user?.role);
    fetchDestinations();
  }, [user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const destinationData = {
        ...formData,
        images: formData.images.split(',').map(img => img.trim())
      };

      if (editingDestination) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/destinations`,
          { ...destinationData, destinationId: editingDestination._id },
          { headers }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/destinations`,
          destinationData,
          { headers }
        );
      }
      setShowForm(false);
      setEditingDestination(null);
      setFormData({
        name: '',
        location: '',
        description: '',
        price: '',
        category: '',
        rating: '',
        images: ''
      });
      fetchDestinations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save destination');
    }
  };

  const handleEdit = (dest) => {
    setEditingDestination(dest);
    setFormData({
      name: dest.name,
      location: dest.location,
      description: dest.description,
      price: dest.price,
      category: dest.category,
      rating: dest.rating,
      images: dest.images.join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/destinations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: { destinationId: id }
        });
        fetchDestinations();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete destination');
      }
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem' }}>All Destinations</h2>
        {user?.role === 'admin' && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingDestination(null);
              setFormData({
                name: '',
                location: '',
                description: '',
                price: '',
                category: '',
                rating: '',
                images: ''
              });
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#000000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add New Destination
          </button>
        )}
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {showForm && user?.role === 'admin' && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '2rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>
            {editingDestination ? 'Edit Destination' : 'Add New Destination'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name:</label>
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
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
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
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price:</label>
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">Select a category</option>
                <option value="beach">Beach</option>
                <option value="mountain">Mountain</option>
                <option value="city">City</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rating:</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
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
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Images (comma-separated URLs):</label>
              <input
                type="text"
                name="images"
                value={formData.images}
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
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: '#000000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {editingDestination ? 'Update Destination' : 'Add Destination'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingDestination(null);
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {destinations.map(destination => (
          <div key={destination._id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <img
              src={destination.images?.[0] || 'https://via.placeholder.com/300x200'}
              alt={destination.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{destination.name}</h3>
              <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>{destination.location}</p>
              <p style={{ margin: '0 0 0.5rem 0' }}>{destination.description}</p>
              <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>₹{destination.price}</p>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                <span style={{ backgroundColor: '#f0f0f0', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  {destination.category}
                </span>
              </p>
              <p style={{ margin: '0 0 1rem 0' }}>
                Rating: {Array(5).fill('★').map((star, i) => (
                  <span key={i} style={{ color: i < destination.rating ? '#ffc107' : '#ddd' }}>{star}</span>
                ))}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {user?.role === 'admin' ? (
                  <>
                    <button
                      onClick={() => handleEdit(destination)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#000000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(destination._id)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#000000',
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
                  <Link to={`/bookings/new?destination=${destination._id}`} style={{ flex: 1 }}>
                    <button style={{ 
                      width: '100%',
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      padding: '0.5rem 1rem', 
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}>
                      Book Now
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
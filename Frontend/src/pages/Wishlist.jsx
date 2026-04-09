import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/wishlists`);
      setWishlist(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch wishlist');
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (destinationId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/wishlists/${destinationId}`);
      setWishlist(wishlist.filter(item => item.destination._id !== destinationId));
    } catch (err) {
      setError('Failed to remove from wishlist');
    }
  };

  const handleViewDestination = (destinationId) => {
    navigate(`/destinations/${destinationId}`);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading wishlist...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Your wishlist is empty</p>
          <button
            onClick={() => navigate('/destinations')}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Explore Destinations
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {wishlist.map((item) => (
            <div 
              key={item._id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'transform 0.2s'
              }}
            >
              <img 
                src={item.destination.image} 
                alt={item.destination.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '1.5rem' }}>
                <h2 style={{ marginBottom: '0.5rem', color: '#333' }}>{item.destination.name}</h2>
                <p style={{ color: '#666', marginBottom: '1rem' }}>{item.destination.description}</p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <button
                    onClick={() => handleViewDestination(item.destination._id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.destination._id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist; 
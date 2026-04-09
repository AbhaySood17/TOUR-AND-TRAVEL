import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Booking.css';

const Bookings = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  
  // Get booking type and ID from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const destinationId = searchParams.get('destination');
  const packageId = searchParams.get('package');
  const bookingType = packageId ? 'package' : 'destination';
  const bookingId = packageId || destinationId;
  const isNewBooking = location.pathname.includes('new');

  const [formData, setFormData] = useState({
    bookingType,
    bookingId,
    travelDate: '',
    travelers: 1,
    totalPrice: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isNewBooking) {
      fetchBookings();
    } else {
      fetchBookingDetails();
    }
  }, [user, token, navigate, isNewBooking, bookingType, bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const endpoint = bookingType === 'package' 
        ? `${import.meta.env.VITE_API_URL}/api/packages/${bookingId}`
        : `${import.meta.env.VITE_API_URL}/api/destinations/${bookingId}`;
      
      const response = await axios.get(endpoint);
      setBookingDetails(response.data);
      setFormData(prev => ({
        ...prev,
        bookingType,
        totalPrice: response.data.price * (bookingType === 'package' ? 1 : prev.travelers)
      }));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Failed to fetch booking details');
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Ensure both destination and package data are populated
      const populatedBookings = response.data.map(booking => {
        const isPackage = booking.package !== null;
        const item = isPackage ? booking.package : booking.destination;
        if (!item) return null; // Skip if neither package nor destination exists
        return {
          _id: booking._id,
          name: item.name || 'N/A',
          type: isPackage ? 'Package' : 'Destination',
          price: item.price || 0,
          location: isPackage ? `Duration: ${item.duration || 'N/A'} days` : `Location: ${item.location || 'N/A'}`,
          description: item.description || 'N/A',
          itinerary: isPackage && item.itinerary ? item.itinerary : null,
          travelDate: booking.travelDate,
          travelers: booking.travelers,
          totalPrice: booking.totalPrice,
          status: booking.status,
          // Add package-specific fields
          duration: isPackage ? item.duration : null,
          packageDetails: isPackage ? {
            itinerary: item.itinerary || [],
            images: item.images || []
          } : null
        };
      }).filter(booking => booking !== null); // Remove any null bookings
      setBookings(populatedBookings);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.travelDate) {
        setError('Please select a travel date');
        return;
      }

      if (!bookingDetails) {
        setError('Booking details not found');
        return;
      }

      const bookingData = {
        destination: bookingType === 'destination' ? bookingId : null,
        package: bookingType === 'package' ? bookingId : null,
        travelDate: formData.travelDate,
        travelers: formData.travelers,
        totalPrice: formData.totalPrice,
        status: 'pending'
      };
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data) {
        setError('');
        // Show success message in a styled div
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.style.cssText = 'background-color: #4CAF50; color: white; padding: 15px; border-radius: 5px; position: fixed; top: 20px; right: 20px; z-index: 1000; animation: fadeIn 0.5s;';
        successElement.textContent = `${bookingType === 'package' ? 'Package' : 'Destination'} booked successfully! Enjoy your trip!`;
        document.body.appendChild(successElement);
        
        // Remove the success message after 3 seconds
        setTimeout(() => {
          successElement.style.animation = 'fadeOut 0.5s';
          setTimeout(() => document.body.removeChild(successElement), 500);
        }, 3000);
  
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
          }
        `;
        document.head.appendChild(style);
  
        // Navigate to bookings page after showing success message
        setTimeout(() => navigate('/bookings'), 1000);
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.response?.data?.message || 'Failed to create booking');
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { bookingId }
        });
        fetchBookings();
      } catch (err) {
        setError('Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h2>{isNewBooking ? 'Create New Booking' : 'My Bookings'}</h2>
      </div>
      {error && <div className="error-message">{error}</div>}

      {isNewBooking && bookingDetails && (
        <div className="booking-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{bookingType === 'package' ? 'Package' : 'Destination'}:</label>
              <input 
                type="text" 
                value={bookingDetails.name} 
                disabled 
              />
            </div>
            <div className="form-group">
              <label>Travel Date:</label>
              <input
                type="date"
                value={formData.travelDate}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Travelers:</label>
              <input
                type="number"
                min="1"
                value={formData.travelers}
                onChange={(e) => {
                  const travelers = parseInt(e.target.value);
                  const totalPrice = bookingType === 'package' 
                    ? bookingDetails.price 
                    : bookingDetails.price * travelers;
                  setFormData({ 
                    ...formData, 
                    travelers,
                    totalPrice
                  });
                }}
                required
              />
            </div>
            <div className="form-group">
              <label>Total Price:</label>
              <input
                type="number"
                value={formData.totalPrice}
                disabled
              />
              <span className="currency-symbol">₹</span>
            </div>
            <button type="submit" className="submit-button">
              Create Booking
            </button>
          </form>
        </div>
      )}

      {!isNewBooking && (
        <div className="bookings-list">
          {bookings.length === 0 ? (
            <p className="loading">No bookings found.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <h3>{booking.name}</h3>
                <div className="booking-info">
                  <p><strong>Type:</strong> {booking.type}</p>
                  <p>{booking.location}</p>
                  <p><strong>Description:</strong> {booking.description}</p>
                  {booking.type === 'Package' && booking.packageDetails?.itinerary && (
                    <div className="itinerary-section">
                      <p><strong>Itinerary:</strong></p>
                      <ul>
                        {booking.packageDetails.itinerary.map((item, index) => (
                          <li key={index}>Day {item.day}: {item.activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {booking.type === 'Package' && booking.packageDetails?.images && (
                    <div className="package-images">
                      <p><strong>Package Images:</strong></p>
                      <div className="image-grid">
                        {booking.packageDetails.images.slice(0, 3).map((image, index) => (
                          <img key={index} src={image} alt={`Package view ${index + 1}`} className="package-image" />
                        ))}
                      </div>
                    </div>
                  )}
                  <p><strong>Travel Date:</strong> {new Date(booking.travelDate).toLocaleDateString()}</p>
                  <p><strong>Travelers:</strong> {booking.travelers}</p>
                  <p><strong>Total Price:</strong> ₹{booking.totalPrice} ({booking.travelers} travelers)</p>
                </div>
                <div className={`booking-status status-${booking.status.toLowerCase()}`}>
                  {booking.status}
                </div>
                <div className="booking-actions">
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="delete-button"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Bookings;
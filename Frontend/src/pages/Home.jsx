import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import boat from '../pages/img/mountain.jpg';
import paragliding from '../pages/img/paragliding.jpg';
import rafting from '../pages/img/rafting.jpeg';
import backgroundVideo from '../pages/img/videoo.mp4';

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/destinations`;
        setLoading(true);
        const response = await axios.get(apiUrl);
        if (Array.isArray(response.data)) {
          setDestinations(response.data.slice(0, 6));
        } else {
          console.error('API did not return an array:', response.data);
          setDestinations([]);
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Fetch destinations error:', err);
        setError('Failed to fetch destinations');
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const activities = [
    { title: 'Hiking', imgSrc: boat },
    { title: 'Paragliding', imgSrc: paragliding },
    { title: 'Rafting', imgSrc: rafting },
  ];

  const services = [
    { title: 'Travel Planning', description: 'Customized itineraries for your perfect trip.' },
    { title: 'Accommodation', description: 'Stay in the best hotels and resorts worldwide.' },
    { title: 'Guided Tours', description: 'Explore with local experts who know the best spots.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        textAlign: 'center', 
        color: 'white',
        height: '400px',
        width: '100%',
        overflow: 'hidden'
      }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{ 
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: '0'
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div style={{ 
          position: 'relative',
          zIndex: '1',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>Explore the World with Us</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'white' }}>Your adventure starts here</p>
          <Link to="/destinations">
            <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Discover More!
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Images Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#333' }}>Explore Amazing Places</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '0 1rem' }}>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Beautiful landscape"
                style={{ width: '100%', height: '300px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white' }}>
                <h3>Natural Wonders</h3>
              </div>
            </div>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <img 
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Luxury resort"
                style={{ width: '100%', height: '300px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white' }}>
                <h3>Luxury Resorts</h3>
              </div>
            </div>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <img 
                src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
                alt="Adventure activities"
                style={{ width: '100%', height: '300px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white' }}>
                <h3>Adventure Activities</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Featured Destinations</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading ? (
          <p>Loading destinations...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            {Array.isArray(destinations) ? (
              destinations.length > 0 ? (
                destinations.map((destination) => (
                  <div key={destination._id} style={{ border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}>
                    <img
                      src={destination.images[0] || 'https://via.placeholder.com/200'}
                      alt={destination.name}
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '1rem' }}>
                      <h3>{destination.name}</h3>
                      <p>Location: {destination.location}</p>
                      <p>Price: {destination.price}</p>
                      <Link to={`/destinations/${destination._id}`}>
                        <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>No destinations available.</p>
              )
            ) : (
              <p>Invalid data format for destinations.</p>
            )}
          </div>
        )}
      </section>

      {/* Activities */}
      <section style={{ padding: '2rem 0', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Activities You Can Enjoy</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          {activities.map((activity, index) => (
            <div key={index}>
              <img src={activity.imgSrc} alt={activity.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />
              <h3 style={{ marginTop: '0.5rem' }}>{activity.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Our Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          {services.map((service, index) => (
            <div key={index} style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ backgroundColor: '#333', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', marginRight: '2rem' }}>
          Mr. Travels
        </Link>
        <Link to="/destinations" style={{ color: 'white', textDecoration: 'none', margin: '0 1rem' }}>
          Destinations
        </Link>
        <Link to="/packages" style={{ color: 'white', textDecoration: 'none', margin: '0 1rem' }}>
          Packages
        </Link>
        <Link to="/reviews" style={{ color: 'white', textDecoration: 'none', margin: '0 1rem' }}>
          Reviews
        </Link>
        {user && (
          <>
            <Link to="/bookings" style={{ color: 'white', textDecoration: 'none', margin: '0 1rem' }}>
              My Bookings
            </Link>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none', margin: '0 1rem' }}>
              Profile
            </Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <button
            onClick={logout}
            style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', margin: '0 1rem' }}>
            Login/Signup
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
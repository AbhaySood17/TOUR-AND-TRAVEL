import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    console.log('Current user object:', user);
    console.log('User role:', user?.role);
  }, [user]);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/users/`;
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setEditedProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, token, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/users/`;
      await axios.put(apiUrl, editedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(editedProfile);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username' || name === 'email') {
      setEditedProfile(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setEditedProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: value
        }
      }));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img 
          src="https://images.unsplash.com/photo-1544502062-f82887f03d1c?q=80&w=2159&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Profile Logo" 
          className="profile-logo" 
        />
        <div>
          <h2>My Profile</h2>
          <div className="role-badge" style={{ 
            backgroundColor: user && user.role === 'admin' ? '#28a745' : '#007bff',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '15px',
            fontSize: '0.9rem',
            display: 'inline-block',
            marginTop: '0.5rem'
          }}>
            {user && user.role === 'admin' ? 'Administrator' : 'Regular User'}
          </div>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      {profile ? (
        <div className="profile-content">
          <div className="profile-info">
            <div className="info-group">
              <label>Username</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={editedProfile.username}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.username}</p>
              )}
            </div>
            <div className="info-group">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>
            <div className="info-group">
              <label>First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={editedProfile.profile?.firstName || ''}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.profile?.firstName || 'N/A'}</p>
              )}
            </div>
            <div className="info-group">
              <label>Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={editedProfile.profile?.lastName || ''}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.profile?.lastName || 'N/A'}</p>
              )}
            </div>
            <div className="info-group">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editedProfile.profile?.phone || ''}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.profile?.phone || 'N/A'}</p>
              )}
            </div>
            <div className="profile-actions">
              {isEditing ? (
                <button className="save-button" onClick={handleSave}>
                  Save Changes
                </button>
              ) : (
                <button className="edit-button" onClick={handleEdit}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="error-message">No profile data available.</p>
      )}
    </div>
  );
};

export default Profile;
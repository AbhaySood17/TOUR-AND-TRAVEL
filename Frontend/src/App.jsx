import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetails from './pages/DestinationDetails';
import Profile from './pages/Profile';
import Bookings from './pages/Booking.jsx'; 
import Login from './pages/Login';
import Package from './pages/Package';
import Review from './pages/Review';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/destinations" element={<ProtectedRoute element={<Destinations />} />} />
            <Route path="/destinations/:id" element={<ProtectedRoute element={<DestinationDetails />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/bookings" element={<ProtectedRoute element={<Bookings />} />} />
            <Route path="/bookings/new" element={<ProtectedRoute element={<Bookings />} />} />
            <Route path="/packages" element={<ProtectedRoute element={<Package />} />} />
            <Route path="/packages/:id" element={<ProtectedRoute element={<Package />} />} />
            <Route path="/booking/:id" element={<ProtectedRoute element={<Bookings />} />} />
            <Route path="/reviews" element={<ProtectedRoute element={<Review />} />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
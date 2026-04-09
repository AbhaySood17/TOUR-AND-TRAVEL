import React from 'react'
import './AboutUs.css'
import pic from './img/rafting.jpeg'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Navbar.css';
import logo from './img/Screenshot_2024-08-31_150406-removebg-preview.png';
function AboutUs() {
    const [user, setUser] = useState(null);

    // Check localStorage for currentUser when the page loads
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (savedUser) {
            setUser(savedUser); // Update state if user is found in localStorage
        }
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('currentUser'); // Remove the user from localStorage
        setUser(null); // Update state to reflect logout
    };
  return (
    <div>
    <section>
        <div className="top-container">
            <div className="logo">
                <img
                    src={logo}
                    alt="Logo"
                    width="200"
                    height="70"
                />
            </div>

            <nav className="navbar">
                <Link to={user ? "/home" : "/"}><strong>Home</strong></Link>
                <Link to={user ? "/location" : "/loclogin"}><strong>Location</strong></Link>
                <Link to={user ? "/packege" : "/packlogin"}><strong>Packages</strong></Link>
                <Link to="/aboutUs"><strong>About Us</strong></Link>
                <Link to={user ? "/" : "/loclogin"} onClick={handleLogout}>
                    <strong>{user ? "Logout" : "Login"}</strong>
                </Link>
            </nav>
        </div>
    </section>

    <div class="container">
        <div class="about-us">
            <h2>About Us</h2><br/><br/>
            <p>On a mission to build culture and community around environmental stewardship and regenerative living through
                championing outdoor lifestyle and nature connection. This website will connect you and others to enjoy your
                life with nice peoples at amazing locations of world.</p>
            <p>Before, this platform there will be limited services around our globe so our idea is to provide best services
                to our customers and provide them family environmental. We update our website everyday to include best
                places for our customers.</p>
        </div>

        <div class="quote-section">
            <img src={pic} alt="Anthony Bourdain"/>
            <p>Travel isn’t always pretty. It isn’t always comfortable. Sometimes it hurts, it even breaks your heart. But that’s okay. The journey changes you; it should change you. It leaves marks on your memory, on your consciousness, on your heart, and on your body. You take something with you. Hopefully, you leave something good behind.</p>
            <h4>Anthony Bourdain</h4>

        </div>
   
</div>
</div>
  )
}

export default AboutUs
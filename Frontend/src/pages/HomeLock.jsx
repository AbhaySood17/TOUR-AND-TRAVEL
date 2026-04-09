import React,{useEffect , useState} from 'react'
import './Navbar.css';
import { Link } from 'react-router-dom';
import logo from './img/Screenshot_2024-08-31_150406-removebg-preview.png';
function HomeLock() {
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


    <div class="background"> 
        <div class="line1">
            MR. TRAVELS
        </div>

          <br/>

        <div class="line2">
            PLAN YOUR TRIP WITH US TRAVEL AROUND THE WORLD WITH MOST AFFORDABLE PACKAGES!
        </div>

        <div class="button-container">
            <button>
                 <Link to='/loclogin' >Register Now!</Link>
                 </button>
        </div>
        
   </div>
    </div>
  )
}

export default HomeLock
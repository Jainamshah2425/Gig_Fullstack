import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`bg-white sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          scrolled ? 'h-14' : 'h-16'
        }`}>
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:scale-110 transition-transform duration-200">
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="inline-block"
            >
              GigFlow
            </motion.span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/" active={location.pathname === '/'}>Browse Gigs</NavLink>
                <NavLink to="/my-gigs" active={location.pathname === '/my-gigs'}>My Gigs</NavLink>
                <NavLink to="/create-gig" active={location.pathname === '/create-gig'}>Post Gig</NavLink>
                <span className="text-gray-600">
                  Welcome, {user?.name}
                </span>
                <Button onClick={handleLogout} variant="secondary">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, active, children }) => (
  <Link to={to} className="relative group">
    <span className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
      active ? 'text-blue-600 font-semibold' : ''
    }`}>
      {children}
    </span>
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: active ? 1 : 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.2 }}
    />
  </Link>
);

export default Navbar;

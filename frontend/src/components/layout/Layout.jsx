import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Toast from '../common/Toast';

export const Layout = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 animate-gradient">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="py-8"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Toast />
    </div>
  );
};

export default Layout;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import client from '../../api/client';
import GigCard from './GigCard';
import Loader from '../common/Loader';

export const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchGigs();
  }, [search]);
  
  const fetchGigs = async () => {
    try {
      setLoading(true);
      const { data } = await client.get(`/api/gigs?search=${search}`);
      setGigs(data.gigs);
    } catch (error) {
      console.error('Failed to fetch gigs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8"
      >
        Browse Gigs
      </motion.h1>
      
      {/* Search bar */}
      <motion.input
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        type="text"
        placeholder="Search gigs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
      
      {/* Gig grid */}
      {loading ? (
        <Loader text="Loading gigs..." />
      ) : gigs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig, index) => (
            <GigCard key={gig._id} gig={gig} index={index} />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl mb-4"
          >
            📭
          </motion.div>
          <p className="text-gray-500 text-lg">No gigs found</p>
        </motion.div>
      )}
    </div>
  );
};

export default GigList;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const GigCard = ({ gig, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-2xl transition-shadow duration-300"
    >
      <h3 className="text-xl font-bold mb-2">{gig.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <motion.span 
          className="text-2xl font-bold text-blue-600"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          ${gig.budget}
        </motion.span>
        <span className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
          gig.status === 'open' 
            ? 'bg-green-100 text-green-800 animate-pulse' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {gig.status}
        </span>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        Posted by: {gig.ownerId?.name || 'Unknown'}
      </div>
      
      <Link
        to={`/gigs/${gig._id}`}
        className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        View Details
      </Link>
    </motion.div>
  );
};

export default GigCard;

import Button from '../common/Button';
import { motion } from 'framer-motion';

export const BidCard = ({ bid, onHire, index = 0 }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-lg">{bid.freelancerId.name}</h4>
          <p className="text-sm text-gray-600">{bid.freelancerId.email}</p>
        </div>
        <div className="text-right">
          <motion.div 
          className="text-2xl font-bold text-blue-600"
          whileHover={{ scale: 1.05 }}
        >
            ${bid.proposedPrice}
          </motion.div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs mt-2 transition-all duration-200 ${getStatusColor(bid.status)} ${
            bid.status === 'pending' ? 'animate-pulse' : ''
          }`}>
            {bid.status}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h5 className="font-semibold text-gray-700 mb-2">Proposal:</h5>
        <p className="text-gray-600 whitespace-pre-wrap">{bid.message}</p>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Submitted: {new Date(bid.createdAt).toLocaleString()}
      </div>

      {bid.status === 'pending' && onHire && (
        <Button
          onClick={onHire}
          variant="success"
          className="w-full"
        >
          Hire This Freelancer
        </Button>
      )}
    </motion.div>
  );
};

export default BidCard;

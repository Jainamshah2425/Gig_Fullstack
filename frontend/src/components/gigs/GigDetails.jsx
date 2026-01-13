import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import BidForm from '../bids/BidForm';
import BidList from '../bids/BidList';
import Loader from '../common/Loader';
import Button from '../common/Button';

export const GigDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      const { data } = await client.get(`/api/gigs/${id}`);
      setGig(data.gig);
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to fetch gig');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading gig details..." />;
  }

  if (!gig) {
    return null;
  }

  const isOwner = user && gig.ownerId._id === user.id;
  const canBid = user && !isOwner && gig.status === 'open';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          ← Back
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-8 mb-6"
      >
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{gig.title}</h1>
          <span className={`px-4 py-2 rounded-full ${
            gig.status === 'open' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {gig.status}
          </span>
        </div>

        <div className="text-gray-600 mb-4">
          Posted by: <span className="font-medium">{gig.ownerId.name}</span>
        </div>

        <motion.div 
          className="text-3xl font-bold text-blue-600 mb-6"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring" }}
        >
          Budget: ${gig.budget}
        </motion.div>

        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{gig.description}</p>
        </div>

        <div className="text-sm text-gray-500 mt-6">
          Posted on: {new Date(gig.createdAt).toLocaleDateString()}
        </div>
      </motion.div>

      {/* Bid Form (for freelancers) */}
      {canBid && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8 mb-6"
        >
          <h2 className="text-2xl font-bold mb-4">Submit Your Bid</h2>
          <BidForm gigId={gig._id} onBidSubmitted={fetchGig} />
        </motion.div>
      )}

      {/* Bid List (for gig owner) */}
      {isOwner && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <BidList gigId={gig._id} />
        </motion.div>
      )}

      {/* Login prompt */}
      {!user && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 rounded-lg p-6 text-center"
        >
          <p className="text-gray-700 mb-4">
            Please login to bid on this gig
          </p>
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default GigDetails;

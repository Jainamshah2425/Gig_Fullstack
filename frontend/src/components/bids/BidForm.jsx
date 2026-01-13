import { useState } from 'react';
import { motion } from 'framer-motion';
import client from '../../api/client';
import { useToast } from '../../hooks/useToast';
import Input from '../common/Input';
import Button from '../common/Button';

export const BidForm = ({ gigId, onBidSubmitted }) => {
  const [formData, setFormData] = useState({
    message: '',
    proposedPrice: ''
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await client.post('/api/bids', {
        gigId,
        message: formData.message,
        proposedPrice: parseFloat(formData.proposedPrice)
      });
      
      showSuccess('Bid submitted successfully!');
      setFormData({ message: '', proposedPrice: '' });
      
      if (onBidSubmitted) {
        onBidSubmitted();
      }
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to submit bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
          Your Proposal <span className="text-red-500">*</span>
        </label>
        <motion.textarea
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Explain why you're the best fit for this gig..."
          required
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      <Input
        label="Your Proposed Price ($)"
        type="number"
        name="proposedPrice"
        value={formData.proposedPrice}
        onChange={handleChange}
        placeholder="Enter your price"
        required
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          loading={loading}
        >
          Submit Bid
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default BidForm;

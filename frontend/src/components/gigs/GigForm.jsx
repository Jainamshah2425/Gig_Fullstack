import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import client from '../../api/client';
import { useToast } from '../../hooks/useToast';
import Input from '../common/Input';
import Button from '../common/Button';

export const GigForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
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
      await client.post('/api/gigs', {
        ...formData,
        budget: parseFloat(formData.budget)
      });
      showSuccess('Gig created successfully!');
      navigate('/my-gigs');
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Create New Gig
      </motion.h2>
      
      <motion.form 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-lg shadow-md"
      >
        <Input
          label="Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Build a React website"
          required
        />
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <motion.textarea
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your gig in detail..."
            required
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
        
        <Input
          label="Budget ($)"
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          placeholder="e.g., 500"
          required
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <Button
            type="submit"
            className="flex-1"
            disabled={loading}
            loading={loading}
          >
            Create Gig
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default GigForm;

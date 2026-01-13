import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import Input from '../common/Input';
import Button from '../common/Button';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { name, email, password } = formData;
      await register({ name, email, password });
      showSuccess('Registration successful!');
      navigate('/');
    } catch (error) {
      showError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
        
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password (min 6 characters)"
          required
        />
        
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />
        
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>

      <p className="text-center mt-4 text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;

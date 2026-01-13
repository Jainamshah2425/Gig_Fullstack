import { motion } from 'framer-motion';
import { useState } from 'react';

export const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  className = '',
  error = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="mb-4">
      {label && (
        <motion.label 
          htmlFor={name} 
          className="block text-gray-700 font-medium mb-2"
          animate={{ 
            y: isFocused && value ? -2 : 0,
            color: isFocused ? '#2563eb' : '#374151'
          }}
          transition={{ duration: 0.2 }}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </motion.label>
      )}
      <motion.input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        required={required}
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
          error ? 'border-red-500 shake' : 'border-gray-300'
        } ${className}`}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;

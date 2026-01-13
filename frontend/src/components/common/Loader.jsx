import { motion } from 'framer-motion';

export const Loader = ({ size = 'medium', text = '' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`rounded-full border-4 border-blue-200 border-t-blue-600 ${sizeClasses[size]}`}
      />
      {text && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-600 animate-pulse"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;

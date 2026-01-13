import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';

export const Toast = () => {
  const { notifications, removeNotification } = useNotification();

  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`${typeStyles[notification.type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px]`}
          >
            <div className="flex items-center gap-3">
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-xl font-bold"
              >
                {icons[notification.type]}
              </motion.span>
              <span>{notification.message}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-white hover:text-gray-200 text-xl font-bold"
            >
              ×
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;

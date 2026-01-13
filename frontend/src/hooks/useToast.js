import { useNotification } from '../context/NotificationContext';

export const useToast = () => {
  const { addNotification } = useNotification();

  const showToast = (message, type = 'info') => {
    addNotification({ message, type });
  };

  const showSuccess = (message) => showToast(message, 'success');
  const showError = (message) => showToast(message, 'error');
  const showInfo = (message) => showToast(message, 'info');
  const showWarning = (message) => showToast(message, 'warning');

  return { showToast, showSuccess, showError, showInfo, showWarning };
};

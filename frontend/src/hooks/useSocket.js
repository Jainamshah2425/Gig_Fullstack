import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  useEffect(() => {
    if (user) {
      // Connect to Socket.io server
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        withCredentials: true
      });
      
      // Join user's room
      newSocket.emit('join', user.id);
      
      // Listen for 'hired' events
      newSocket.on('hired', (data) => {
        addNotification({
          type: 'success',
          message: data.message
        });
      });
      
      setSocket(newSocket);
      
      return () => newSocket.close();
    }
  }, [user]);
  
  return socket;
};

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useSocket } from './hooks/useSocket';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGig from './pages/CreateGig';
import MyGigs from './pages/MyGigs';
import GigDetailsPage from './pages/GigDetailsPage';
import Loader from './components/common/Loader';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader text="Loading..." />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Socket Wrapper Component
const SocketWrapper = ({ children }) => {
  useSocket(); // Initialize socket connection
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <SocketWrapper>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/gigs/:id" element={<GigDetailsPage />} />
                
                {/* Protected Routes */}
                <Route
                  path="/create-gig"
                  element={
                    <ProtectedRoute>
                      <CreateGig />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-gigs"
                  element={
                    <ProtectedRoute>
                      <MyGigs />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </SocketWrapper>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

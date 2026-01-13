import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../hooks/useToast';
import Loader from '../components/common/Loader';

export const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const fetchMyGigs = async () => {
    try {
      const { data } = await client.get('/api/gigs/my-gigs');
      setGigs(data.gigs);
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to fetch your gigs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading your gigs..." />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">My Gigs</h1>

      {gigs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg mb-4">You haven't posted any gigs yet</p>
          <Link
            to="/create-gig"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Create Your First Gig
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {gigs.map((gig) => (
            <div key={gig._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{gig.title}</h3>
                  <p className="text-gray-600 mb-4">{gig.description}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm ml-4 ${
                  gig.status === 'open' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {gig.status}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ${gig.budget}
                </span>
                <Link
                  to={`/gigs/${gig._id}`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Details & Bids
                </Link>
              </div>

              <div className="text-sm text-gray-500 mt-4">
                Posted: {new Date(gig.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;

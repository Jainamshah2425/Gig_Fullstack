import { useState, useEffect } from 'react';
import client from '../../api/client';
import { useToast } from '../../hooks/useToast';
import BidCard from './BidCard';
import Loader from '../common/Loader';

export const BidList = ({ gigId }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchBids();
  }, [gigId]);

  const fetchBids = async () => {
    try {
      const { data } = await client.get(`/api/bids/gig/${gigId}`);
      setBids(data.bids);
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to fetch bids');
    } finally {
      setLoading(false);
    }
  };

  const handleHire = async (bidId) => {
    if (!confirm('Are you sure you want to hire this freelancer? This action cannot be undone.')) {
      return;
    }

    try {
      await client.patch(`/api/bids/${bidId}/hire`);
      showSuccess('Freelancer hired successfully!');
      
      // Refresh bids list
      fetchBids();
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to hire freelancer');
    }
  };

  if (loading) {
    return <Loader text="Loading bids..." />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Bids ({bids.length})
      </h2>

      {bids.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No bids submitted yet
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid, index) => (
            <BidCard
              key={bid._id}
              bid={bid}
              index={index}
              onHire={bid.status === 'pending' ? () => handleHire(bid._id) : null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BidList;

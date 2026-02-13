import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimData, setClaimData] = useState({
    registration_number: '',
    college_details: '',
    hidden_detail_entered: '',
  });

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Error loading item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    setClaiming(true);

    try {
      await api.post('/claims/request', {
        item_id: parseInt(id),
        ...claimData,
      });
      alert('Claim request submitted! Please visit the security point with your details.');
      navigate('/items');
    } catch (error) {
      console.error('Error claiming item:', error);
      alert(error.response?.data?.detail || 'Failed to claim item. Please check your verification detail.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!item) {
    return <div className="error">Item not found</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US');
  };

  return (
    <div className="page-container">
      <div className="item-detail">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Back
        </button>

        <div className="item-detail-header">
          <h1>{item.title}</h1>
          <span className={`status-badge status-${item.status}`}>
            {item.status}
          </span>
        </div>

        <div className="item-detail-content">
          <div className="item-detail-section">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="item-detail-grid">
            <div className="item-detail-section">
              <h3>Category</h3>
              <p>{item.category}</p>
            </div>

            <div className="item-detail-section">
              <h3>Item Code</h3>
              <p className="item-code-large">{item.item_code}</p>
            </div>

            <div className="item-detail-section">
              <h3>Found At</h3>
              <p>{formatDate(item.found_at)}</p>
            </div>

            <div className="item-detail-section">
              <h3>Place Details</h3>
              <p>{item.place_details || 'N/A'}</p>
            </div>
          </div>

          {item.image_path && (
            <div className="item-detail-section">
              <h3>Photo</h3>
              <img src={`http://localhost:8000/${item.image_path}`} alt={item.title} className="item-image" />
            </div>
          )}

          <div className="item-detail-section">
            <h3>Security Point</h3>
            <p>Please visit the security point to claim this item.</p>
            <p className="security-info">
              <strong>Building ID:</strong> {item.building_id}<br />
              <strong>Security Point ID:</strong> {item.security_point_id}
            </p>
          </div>
        </div>

        {item.status === 'stored' && (
          <div className="claim-section">
            {!showClaimForm ? (
              <button
                onClick={() => setShowClaimForm(true)}
                className="btn-primary"
              >
                Claim This Item
              </button>
            ) : (
              <form onSubmit={handleClaim} className="claim-form">
                <h3>Claim Request</h3>
                <div className="form-group">
                  <label>Registration Number *</label>
                  <input
                    type="text"
                    required
                    value={claimData.registration_number}
                    onChange={(e) =>
                      setClaimData({ ...claimData, registration_number: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>College Details *</label>
                  <textarea
                    required
                    rows="3"
                    value={claimData.college_details}
                    onChange={(e) =>
                      setClaimData({ ...claimData, college_details: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Verification Detail *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter the hidden verification detail"
                    value={claimData.hidden_detail_entered}
                    onChange={(e) =>
                      setClaimData({ ...claimData, hidden_detail_entered: e.target.value })
                    }
                  />
                  <small>This must match the detail provided by the finder</small>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowClaimForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={claiming}>
                    {claiming ? 'Submitting...' : 'Submit Claim'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;


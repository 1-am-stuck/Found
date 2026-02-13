import React, { useState, useEffect } from 'react';
import api from '../api/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [selectedTab, setSelectedTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (selectedTab === 'stats') {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } else if (selectedTab === 'items') {
        const response = await api.get('/admin/items');
        setItems(response.data);
      } else if (selectedTab === 'claims') {
        const response = await api.get('/admin/claims');
        setClaims(response.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClaim = async (claimId, result) => {
    try {
      await api.post('/claims/verify', {
        claim_id: claimId,
        verification_result: result,
      });
      alert(`Claim ${result}`);
      loadData();
    } catch (error) {
      console.error('Error verifying claim:', error);
      alert('Failed to verify claim');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="admin-tabs">
        <button
          className={selectedTab === 'stats' ? 'active' : ''}
          onClick={() => setSelectedTab('stats')}
        >
          Statistics
        </button>
        <button
          className={selectedTab === 'items' ? 'active' : ''}
          onClick={() => setSelectedTab('items')}
        >
          Items
        </button>
        <button
          className={selectedTab === 'claims' ? 'active' : ''}
          onClick={() => setSelectedTab('claims')}
        >
          Claims
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {selectedTab === 'stats' && stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Items</h3>
                <p className="stat-number">{stats.total_items}</p>
              </div>
              <div className="stat-card">
                <h3>Stored Items</h3>
                <p className="stat-number">{stats.stored_items}</p>
              </div>
              <div className="stat-card">
                <h3>Claimed Items</h3>
                <p className="stat-number">{stats.claimed_items}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Claims</h3>
                <p className="stat-number">{stats.pending_claims}</p>
              </div>
            </div>
          )}

          {selectedTab === 'items' && (
            <div className="admin-items">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Security Point</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.item_code}</td>
                      <td>{item.title}</td>
                      <td>{item.category}</td>
                      <td>
                        <span className={`status-badge status-${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.security_point_id}</td>
                      <td>{formatDate(item.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedTab === 'claims' && (
            <div className="admin-claims">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item Code</th>
                    <th>Claimant</th>
                    <th>Registration</th>
                    <th>College Details</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id}>
                      <td>{claim.item_id}</td>
                      <td>User #{claim.claimed_by}</td>
                      <td>{claim.registration_number}</td>
                      <td>{claim.college_details}</td>
                      <td>
                        {claim.verification_result || (
                          <span className="status-badge status-pending">Pending</span>
                        )}
                      </td>
                      <td>
                        {!claim.verification_result && (
                          <div className="claim-actions">
                            <button
                              onClick={() => handleVerifyClaim(claim.id, 'verified')}
                              className="btn-success"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleVerifyClaim(claim.id, 'rejected')}
                              className="btn-danger"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;


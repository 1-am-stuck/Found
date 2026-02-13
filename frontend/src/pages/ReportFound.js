import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function ReportFound() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [securityPoints, setSecurityPoints] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [mapLat, setMapLat] = useState(12.9716);
  const [mapLon, setMapLon] = useState(77.5946);
  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLon, setSelectedLon] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    building_id: '',
    security_point_id: '',
    place_details: '',
    found_at: new Date().toISOString().slice(0, 16),
    hidden_detail: '',
    is_high_value: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBuildings();
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      loadSecurityPoints(selectedBuilding);
    }
  }, [selectedBuilding]);

  const loadBuildings = async () => {
    try {
      const response = await api.get('/buildings');
      setBuildings(response.data);
    } catch (error) {
      console.error('Error loading buildings:', error);
    }
  };

  const loadSecurityPoints = async (buildingId) => {
    try {
      const response = await api.get(`/buildings/security-points?building_id=${buildingId}`);
      setSecurityPoints(response.data);
    } catch (error) {
      console.error('Error loading security points:', error);
    }
  };

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simple approximation - in production, use proper map library
    const lat = mapLat + (y - rect.height / 2) * 0.0001;
    const lon = mapLon + (x - rect.width / 2) * 0.0001;
    
    setSelectedLat(lat);
    setSelectedLon(lon);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLat || !selectedLon) {
      alert('Please select a location on the map');
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        ...formData,
        latitude: selectedLat,
        longitude: selectedLon,
        building_id: parseInt(formData.building_id),
        security_point_id: parseInt(formData.security_point_id),
      };

      const response = await api.post('/items/report', itemData);
      alert(`Item reported successfully! Code: ${response.data.item_code}`);
      navigate('/items');
    } catch (error) {
      console.error('Error reporting item:', error);
      alert('Failed to report item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Report Found Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            required
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Select category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Accessories">Accessories</option>
            <option value="Documents">Documents</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Select Location on Map *</label>
          <div className="map-selector" onClick={handleMapClick}>
            <div className="map-placeholder">
              {selectedLat && selectedLon ? (
                <div>
                  <p>Location selected</p>
                  <p className="coordinates">
                    Lat: {selectedLat.toFixed(6)}, Lon: {selectedLon.toFixed(6)}
                  </p>
                  <p className="map-hint">Click to change location</p>
                </div>
              ) : (
                <p>Click on the map to select item location</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Building *</label>
          <select
            required
            value={selectedBuilding}
            onChange={(e) => {
              setSelectedBuilding(e.target.value);
              setFormData({ ...formData, building_id: e.target.value, security_point_id: '' });
            }}
          >
            <option value="">Select building</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Security Drop-off Point *</label>
          <select
            required
            value={formData.security_point_id}
            onChange={(e) => setFormData({ ...formData, security_point_id: e.target.value })}
            disabled={!selectedBuilding}
          >
            <option value="">Select security point</option>
            {securityPoints.map((point) => (
              <option key={point.id} value={point.id}>
                {point.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Place Details</label>
          <input
            type="text"
            placeholder="e.g., Room 101, Lab 2, Corridor A"
            value={formData.place_details}
            onChange={(e) => setFormData({ ...formData, place_details: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Time Found *</label>
          <input
            type="datetime-local"
            required
            value={formData.found_at}
            onChange={(e) => setFormData({ ...formData, found_at: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Hidden Verification Detail *</label>
          <input
            type="text"
            required
            placeholder="A detail only the owner would know"
            value={formData.hidden_detail}
            onChange={(e) => setFormData({ ...formData, hidden_detail: e.target.value })}
          />
          <small>This will be used to verify ownership</small>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.is_high_value}
              onChange={(e) => setFormData({ ...formData, is_high_value: e.target.checked })}
            />
            High-value item (requires photo verification)
          </label>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Report Found Item'}
        </button>
      </form>
    </div>
  );
}

export default ReportFound;


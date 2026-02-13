import React, { useState, useEffect } from 'react';
import api from '../api/api';
import ItemCard from '../components/ItemCard';

function FoundList() {
  const [items, setItems] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    building_id: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBuildings();
    loadItems();
  }, []);

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadBuildings = async () => {
    try {
      const response = await api.get('/buildings');
      setBuildings(response.data);
    } catch (error) {
      console.error('Error loading buildings:', error);
    }
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.building_id) params.append('building_id', filters.building_id);
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/items?${params.toString()}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Found Items</h1>
        <p>Browse items found on campus</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Accessories">Accessories</option>
            <option value="Documents">Documents</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Building</label>
          <select
            value={filters.building_id}
            onChange={(e) => setFilters({ ...filters, building_id: e.target.value })}
          >
            <option value="">All Buildings</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="stored">Stored</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">No items found</div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FoundList;


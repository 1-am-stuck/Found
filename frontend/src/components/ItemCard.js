import React from 'react';
import { Link } from 'react-router-dom';

function ItemCard({ item }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link to={`/items/${item.id}`} className="item-card">
      <div className="item-card-header">
        <h3>{item.title}</h3>
        <span className={`status-badge status-${item.status}`}>
          {item.status}
        </span>
      </div>
      <p className="item-description">{item.description}</p>
      <div className="item-meta">
        <span className="item-category">{item.category}</span>
        <span className="item-date">{formatDate(item.created_at)}</span>
      </div>
      <div className="item-code">Code: {item.item_code}</div>
    </Link>
  );
}

export default ItemCard;


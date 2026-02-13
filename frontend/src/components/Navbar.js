import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Campus FOUND
        </Link>
        <div className="navbar-menu">
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Map
          </Link>
          <Link
            to="/items"
            className={location.pathname === '/items' ? 'active' : ''}
          >
            Found Items
          </Link>
          <Link
            to="/report"
            className={location.pathname === '/report' ? 'active' : ''}
          >
            Report Found
          </Link>
          <Link
            to="/admin"
            className={location.pathname === '/admin' ? 'active' : ''}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


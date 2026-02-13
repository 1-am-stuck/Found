import React from 'react';
import MapView from '../components/MapView';

function Home() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Campus Lost & Found</h1>
        <p>View found items on the campus map</p>
      </div>
      <MapView />
    </div>
  );
}

export default Home;


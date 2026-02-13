import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportFound from './pages/ReportFound';
import FoundList from './pages/FoundList';
import ItemDetail from './pages/ItemDetail';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportFound />} />
          <Route path="/items" element={<FoundList />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


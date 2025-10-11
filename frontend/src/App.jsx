import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CampaignPage from './pages/CampaignPage';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        {/* Main App */}
        <Routes>
          {/* Public Routes with Layout (Navbar) */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
          
          {/* Campaign Generator */}
          <Route path="/campaign" element={<Layout><CampaignPage /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

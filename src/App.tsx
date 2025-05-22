import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import CampaignList from './components/CampaignList';
import CreateCampaign from './components/CreateCampaign';
import CampaignDetails from './components/CampaignDetails';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Web3Provider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            <div className="container-custom">
              <Routes>
                <Route path="/" element={<CampaignList />} />
                <Route path="/create" element={<CreateCampaign />} />
                <Route path="/campaign/:id" element={<CampaignDetails />} />
              </Routes>
            </div>
          </div>
        </Router>
      </Web3Provider>
    </ThemeProvider>
  );
};

export default App; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { CommunityProvider } from './context/CommunityContext';
import Header from './components/Header';
import Home from './pages/Home';
import Communities from './pages/Communities';
import MyCommunity from './pages/MyCommunity';
import MyProposals from './pages/MyProposals';
import MyVotes from './pages/MyVotes';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <CommunityProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/my-community" element={<MyCommunity />} />
                <Route path="/my-proposals" element={<MyProposals />} />
                <Route path="/my-votes" element={<MyVotes />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CommunityProvider>
    </WalletProvider>
  );
}

export default App;

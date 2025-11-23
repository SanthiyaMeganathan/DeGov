import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import './Home.css';

const Home = () => {
  const { isConnected } = useWallet();

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to DeGov
          </h1>
          <p className="hero-subtitle">
            Decentralized Governance Platform on Arbitrum
          </p>
          <p className="hero-description">
            Join communities, create proposals, and participate in decentralized decision-making. 
            Build the future of governance together.
          </p>
          
          {!isConnected ? (
            <div className="cta-section">
              <p className="connect-prompt">
                Connect your wallet to start participating in governance
              </p>
              <div className="features-grid">
                <div className="feature-card">
                  <h3>🏛️ Join Communities</h3>
                  <p>Connect your wallet to join any community and participate in governance decisions</p>
                </div>
                <div className="feature-card">
                  <h3>📝 Create Proposals</h3>
                  <p>Submit proposals to drive change and innovation within your communities</p>
                </div>
                <div className="feature-card">
                  <h3>🗳️ Vote</h3>
                  <p>Cast your vote on proposals and help shape the future of your communities</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard-preview">
              <h2>What would you like to do?</h2>
              <div className="quick-actions">
                <Link to="/communities" className="action-card">
                  <div className="action-icon">🌐</div>
                  <h3>Explore Communities</h3>
                  <p>Discover and join communities that match your interests</p>
                </Link>
                <Link to="/my-community" className="action-card">
                  <div className="action-icon">👥</div>
                  <h3>My Communities</h3>
                  <p>View and manage communities you're part of</p>
                </Link>
                <Link to="/my-proposals" className="action-card">
                  <div className="action-icon">📋</div>
                  <h3>My Proposals</h3>
                  <p>Track proposals you've created across all communities</p>
                </Link>
                <Link to="/my-votes" className="action-card">
                  <div className="action-icon">✅</div>
                  <h3>My Votes</h3>
                  <p>Review your voting history and participation</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="info-section">
        <div className="info-container">
          <h2>How it Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Connect Wallet</h3>
              <p>Connect your MetaMask wallet to interact with the platform on Arbitrum network</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Join Communities</h3>
              <p>Browse and join communities that align with your interests and values</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Participate</h3>
              <p>Create proposals, vote on decisions, and help govern your communities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
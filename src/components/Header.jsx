import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import WalletButton from './WalletButton';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { isConnected } = useWallet();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/communities', label: 'Communities' },
    { path: '/my-community', label: 'My Community', requiresWallet: true, tooltipText: 'Connect your wallet to access My Community' },
    { path: '/my-proposals', label: 'My Proposals', requiresWallet: true, tooltipText: 'Connect your wallet to access My Proposals' },
    { path: '/my-votes', label: 'My Votes', requiresWallet: true, tooltipText: 'Connect your wallet to access My Votes' },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1>DeGov</h1>
            <span className="logo-subtitle">Decentralized Governance</span>
          </Link>
        </div>
        
        <nav className="nav">
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isDisabled = item.requiresWallet && !isConnected;
              
              return (
                <li key={item.path} className="nav-item">
                  <div className={`nav-link-wrapper ${isDisabled ? 'disabled-wrapper' : ''}`}>
                    <Link
                      to={isDisabled ? '#' : item.path}
                      className={`nav-link ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={isDisabled ? (e) => e.preventDefault() : undefined}
                    >
                      {item.label}
                      {item.requiresWallet && !isConnected && (
                        <span className="wallet-required">🔒</span>
                      )}
                    </Link>
                    {isDisabled && item.tooltipText && (
                      <div className="wallet-tooltip">
                        {item.tooltipText}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="wallet-section">
          <WalletButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
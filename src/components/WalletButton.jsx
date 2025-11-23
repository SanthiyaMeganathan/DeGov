import React from 'react';
import { useWallet } from '../context/WalletContext';
import './WalletButton.css';

const WalletButton = () => {
  const {
    account,
    isConnecting,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isArbitrumNetwork,
    switchToArbitrum,
  } = useWallet();

  if (account) {
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <div className="wallet-address">{formatAddress(account)}</div>
          {!isArbitrumNetwork() && (
            <button 
              className="switch-network-btn"
              onClick={switchToArbitrum}
            >
              Switch to Arbitrum
            </button>
          )}
        </div>
        <button className="disconnect-btn" onClick={disconnectWallet}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button 
      className="connect-wallet-btn" 
      onClick={connectWallet}
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default WalletButton;
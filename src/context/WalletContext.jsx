import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);

  // Arbitrum One chain ID
  const ARBITRUM_CHAIN_ID = '0xa4b1'; // 42161 in hex

  useEffect(() => {
    checkIfWalletIsConnected();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const network = await provider.getNetwork();
        
        setAccount(accounts[0]);
        setProvider(provider);
        setSigner(signer);
        setChainId(`0x${network.chainId.toString(16)}`);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install MetaMask to use this dApp.');
        return;
      }

      setIsConnecting(true);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();

      setAccount(accounts[0]);
      setProvider(provider);
      setSigner(signer);
      setChainId(`0x${network.chainId.toString(16)}`);

      // Check if we're on Arbitrum network
      if (`0x${network.chainId.toString(16)}` !== ARBITRUM_CHAIN_ID) {
        await switchToArbitrum();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToArbitrum = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARBITRUM_CHAIN_ID }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ARBITRUM_CHAIN_ID,
                chainName: 'Arbitrum One',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://arbiscan.io/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Arbitrum network:', addError);
          alert('Failed to add Arbitrum network. Please add it manually.');
        }
      } else {
        console.error('Error switching to Arbitrum:', switchError);
        alert('Failed to switch to Arbitrum network.');
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(chainId);
    // Reload the page when chain changes for simplicity
    window.location.reload();
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isArbitrumNetwork = () => {
    return chainId === ARBITRUM_CHAIN_ID;
  };

  const value = {
    account,
    provider,
    signer,
    isConnecting,
    chainId,
    connectWallet,
    disconnectWallet,
    switchToArbitrum,
    formatAddress,
    isArbitrumNetwork,
    isConnected: !!account,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
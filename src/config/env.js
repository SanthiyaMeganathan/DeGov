// Environment configuration for DeGov
// Centralizes all environment variable access

export const config = {
  // Contract Configuration
  CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS || '',
  
  // Network Configuration
  CHAIN_ID: import.meta.env.VITE_CHAIN_ID || '421614',
  CHAIN_ID_HEX: import.meta.env.VITE_CHAIN_ID_HEX || '0x66eee',
  NETWORK_NAME: import.meta.env.VITE_NETWORK_NAME || 'Arbitrum Sepolia',
  RPC_URL: import.meta.env.VITE_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc',
  BLOCK_EXPLORER_URL: import.meta.env.VITE_BLOCK_EXPLORER_URL || 'https://sepolia.arbiscan.io/',
  
  // Development
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV,
};

// Validation function to check if required environment variables are set
export const validateConfig = () => {
  const requiredVars = ['CONTRACT_ADDRESS'];
  const missing = requiredVars.filter(key => !config[key]);
  
  if (missing.length > 0 && !config.DEV_MODE) {
    console.warn('Missing environment variables:', missing);
    console.warn('Create a .env file based on .env.example');
  }
  
  return missing.length === 0 || config.DEV_MODE;
};

export default config;
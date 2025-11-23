// LocalStorage utilities for wallet-specific data persistence
// Each wallet address gets its own data namespace

const STORAGE_KEYS = {
  COMMUNITIES: 'degov_communities',
  USER_DATA: 'degov_user_data_', // Will be suffixed with wallet address
  GLOBAL_PROPOSALS: 'degov_global_proposals'
};

// Global data that all users see (communities, proposals)
export const saveGlobalData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(data));
    console.log('💾 Saved global communities:', data.length, 'communities');
  } catch (error) {
    console.error('Error saving global data:', error);
  }
};

export const loadGlobalData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMMUNITIES);
    const parsed = data ? JSON.parse(data) : null;
    console.log('📂 Loaded global communities:', parsed?.length || 0, 'communities');
    return parsed;
  } catch (error) {
    console.error('Error loading global data:', error);
    return null;
  }
};

// Wallet-specific data (user memberships, votes, created proposals)
export const saveUserData = (walletAddress, userData) => {
  if (!walletAddress) return;
  
  try {
    const key = `${STORAGE_KEYS.USER_DATA}${walletAddress.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(userData));
    console.log('💾 Saved user data for:', walletAddress.slice(0,6)+'...', userData);
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const loadUserData = (walletAddress) => {
  if (!walletAddress) return null;
  
  try {
    const key = `${STORAGE_KEYS.USER_DATA}${walletAddress.toLowerCase()}`;
    const data = localStorage.getItem(key);
    const parsed = data ? JSON.parse(data) : null;
    console.log('📂 Loaded user data for:', walletAddress.slice(0,6)+'...', parsed);
    return parsed;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

// Helper to get default user data structure
export const getDefaultUserData = () => ({
  joinedCommunities: [], // Community IDs the user has joined
  createdProposals: [],  // Proposal IDs the user created
  votes: [],             // Array of { proposalId, vote, communityId }
  createdCommunities: [] // Community IDs the user created
});

// Clear all data (for development/testing)
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key.includes('_')) {
        // Clear all user-specific data
        Object.keys(localStorage).forEach(storageKey => {
          if (storageKey.startsWith(key)) {
            localStorage.removeItem(storageKey);
          }
        });
      } else {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Get all wallet addresses that have stored data (for debugging)
export const getAllWalletAddresses = () => {
  const addresses = [];
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_KEYS.USER_DATA)) {
        addresses.push(key.replace(STORAGE_KEYS.USER_DATA, ''));
      }
    });
  } catch (error) {
    console.error('Error getting wallet addresses:', error);
  }
  return addresses;
};
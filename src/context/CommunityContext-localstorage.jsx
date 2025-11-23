import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { 
  saveGlobalData, 
  loadGlobalData, 
  saveUserData, 
  loadUserData, 
  getDefaultUserData 
} from '../utils/storage.js';

const CommunityContext = createContext();

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

export const CommunityProvider = ({ children }) => {
  const { isConnected, account } = useWallet();
  const [communities, setCommunities] = useState([]);
  const [userProposals, setUserProposals] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(getDefaultUserData());

  // Load global communities data on app start
  useEffect(() => {
    const savedCommunities = loadGlobalData();
    if (savedCommunities && savedCommunities.length > 0) {
      setCommunities(savedCommunities);
    } else {
      // Initialize with default mock communities if no saved data
      initializeDefaultCommunities();
    }
  }, []);

  // Load user-specific data when wallet connects/changes
  useEffect(() => {
    if (isConnected && account) {
      loadUserSpecificData(account);
    } else {
      // Reset user data when disconnected
      setCurrentUserData(getDefaultUserData());
      setUserProposals([]);
      setUserVotes([]);
    }
  }, [isConnected, account]);

  // Save global data whenever communities change
  useEffect(() => {
    if (communities.length > 0) {
      saveGlobalData(communities);
    }
  }, [communities]);

  // Save user-specific data whenever it changes
  useEffect(() => {
    if (isConnected && account) {
      saveUserData(account, currentUserData);
    }
  }, [currentUserData, isConnected, account]);

  const initializeDefaultCommunities = () => {
    const mockCommunities = [
      {
        id: 1,
        name: 'DeFi Governance',
        description: 'Community focused on decentralized finance governance decisions and protocols.',
        members: 1250,
        proposals: [],
        category: 'defi',
        isJoined: false,
        image: '🏛️'
      },
      {
        id: 2,
        name: 'NFT Collectors',
        description: 'A community for NFT enthusiasts to govern marketplace decisions and curation.',
        members: 890,
        proposals: [],
        category: 'nft',
        isJoined: false,
        image: '🎨'
      },
      {
        id: 3,
        name: 'Environmental DAO',
        description: 'Focusing on environmental initiatives and sustainability projects.',
        members: 567,
        proposals: [],
        category: 'environment',
        isJoined: false,
        image: '🌱'
      },
      {
        id: 4,
        name: 'Gaming Guild',
        description: 'Decentralized gaming community for game governance and tournaments.',
        members: 2100,
        proposals: [],
        category: 'gaming',
        isJoined: false,
        image: '🎮'
      }
    ];

    setCommunities(mockCommunities);
  };

  // Load user-specific data from localStorage
  const loadUserSpecificData = (walletAddress) => {
    const userData = loadUserData(walletAddress);
    if (userData) {
      setCurrentUserData(userData);
      updateUserStatesFromData(userData);
    } else {
      // First time user - initialize with defaults
      const defaultData = getDefaultUserData();
      setCurrentUserData(defaultData);
      updateUserStatesFromData(defaultData);
    }
  };

  // Update user states based on loaded data
  const updateUserStatesFromData = (userData) => {
    // Update communities with user's join status
    setCommunities(prev => prev.map(community => ({
      ...community,
      isJoined: userData.joinedCommunities.includes(community.id)
    })));

    // Set user votes
    setUserVotes(userData.votes || []);
    
    // Note: userProposals will be updated automatically via getUserProposals function
  };

  const joinCommunity = (communityId) => {
    if (!isConnected) {
      alert('Please connect your wallet to join communities');
      return;
    }

    setCommunities(prev =>
      prev.map(community =>
        community.id === communityId
          ? {
              ...community,
              isJoined: !community.isJoined,
              members: community.isJoined ? community.members - 1 : community.members + 1
            }
          : community
      )
    );

    // Update user data
    setCurrentUserData(prev => {
      const isCurrentlyJoined = prev.joinedCommunities.includes(communityId);
      const newJoinedCommunities = isCurrentlyJoined
        ? prev.joinedCommunities.filter(id => id !== communityId)
        : [...prev.joinedCommunities, communityId];
      
      return {
        ...prev,
        joinedCommunities: newJoinedCommunities
      };
    });
  };

  const createCommunity = (newCommunity) => {
    if (!isConnected) {
      alert('Please connect your wallet to create communities');
      return false;
    }

    // Generate a unique ID using timestamp to avoid conflicts
    const community = {
      id: Date.now(),
      name: newCommunity.name,
      description: newCommunity.description,
      members: 1,
      proposals: [],
      category: newCommunity.category,
      isJoined: true,
      image: '🏛️'
    };

    setCommunities(prev => [...prev, community]);

    // Update user data - add to created communities and joined communities
    setCurrentUserData(prev => ({
      ...prev,
      createdCommunities: [...prev.createdCommunities, community.id],
      joinedCommunities: [...prev.joinedCommunities, community.id]
    }));

    return true;
  };

  const createProposal = (communityId, proposal) => {
    if (!isConnected) {
      alert('Please connect your wallet to create proposals');
      return false;
    }

    const community = communities.find(c => c.id === communityId);
    if (!community) {
      alert('Community not found');
      return false;
    }

    // Check if user has joined the community
    if (!community.isJoined) {
      alert('You must join the community before creating proposals');
      return false;
    }

    const newProposal = {
      id: Date.now(),
      title: proposal.title,
      description: proposal.description,
      creator: account,
      votes: { yes: 0, no: 0 },
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      status: 'active',
      communityId: communityId,
      communityName: community.name
    };

    // Update communities with new proposal
    setCommunities(prev =>
      prev.map(community =>
        community.id === communityId
          ? { ...community, proposals: [...community.proposals, newProposal] }
          : community
      )
    );

    // Update user data - add to created proposals
    setCurrentUserData(prev => ({
      ...prev,
      createdProposals: [...prev.createdProposals, newProposal.id]
    }));

    return true;
  };

  const voteOnProposal = (proposalId, vote, communityId) => {
    if (!isConnected) {
      alert('Please connect your wallet to vote');
      return false;
    }

    // Check if user already voted on this specific proposal
    const hasVoted = userVotes.some(v => v.proposalId === proposalId && v.voter === account);
    if (hasVoted) {
      alert('You have already voted on this proposal');
      return false;
    }

    // Find the proposal in any community
    let currentCommunity = null;
    let currentProposal = null;
    
    for (const community of communities) {
      const proposal = community.proposals.find(p => p.id === proposalId);
      if (proposal) {
        currentCommunity = community;
        currentProposal = proposal;
        break;
      }
    }
    
    if (!currentProposal || !currentCommunity) {
      alert('Proposal not found');
      return false;
    }

    // Update proposal vote count in communities
    setCommunities(prev =>
      prev.map(community =>
        community.id === currentCommunity.id
          ? {
              ...community,
              proposals: community.proposals.map(proposal =>
                proposal.id === proposalId
                  ? {
                      ...proposal,
                      votes: {
                        ...proposal.votes,
                        [vote]: (proposal.votes[vote] || 0) + 1
                      }
                    }
                  : proposal
              )
            }
          : community
      )
    );

    // Create updated proposal data for vote record
    const updatedProposal = {
      ...currentProposal,
      votes: {
        ...currentProposal.votes,
        [vote]: (currentProposal.votes[vote] || 0) + 1
      },
      communityName: currentCommunity.name
    };

    // Add to user votes
    const newVote = {
      proposalId,
      vote,
      voter: account,
      voteDate: new Date().toISOString().split('T')[0],
      proposal: updatedProposal
    };
    
    setUserVotes(prev => [...prev, newVote]);

    // Update user data - add to votes
    setCurrentUserData(prev => ({
      ...prev,
      votes: [...prev.votes, newVote]
    }));

    return true;
  };

  const getJoinedCommunities = () => {
    return communities.filter(community => community.isJoined);
  };

  const getUserProposals = () => {
    if (!account) return [];
    
    // Get all proposals from all communities and filter by creator
    const userCreatedProposals = [];
    
    communities.forEach(community => {
      community.proposals.forEach(proposal => {
        if (proposal.creator === account) {
          userCreatedProposals.push({
            ...proposal,
            communityName: community.name,
            yesVotes: proposal.votes?.yes || 0,
            noVotes: proposal.votes?.no || 0
          });
        }
      });
    });
    
    return userCreatedProposals;
  };

  const getUserVotes = () => {
    return userVotes;
  };

  const getCommunityById = (id) => {
    return communities.find(community => community.id === id);
  };

  const hasUserVoted = (proposalId) => {
    return userVotes.some(v => v.proposalId === proposalId && v.voter === account);
  };

  const getUserVoteOnProposal = (proposalId) => {
    const userVote = userVotes.find(v => v.proposalId === proposalId && v.voter === account);
    return userVote?.vote || null;
  };

  // Get all proposals from communities the user has joined (for voting)
  const getAllVoteableProposals = () => {
    if (!account) return [];
    
    const voteableProposals = [];
    
    communities.forEach(community => {
      if (community.isJoined) {
        community.proposals.forEach(proposal => {
          voteableProposals.push({
            ...proposal,
            communityName: community.name,
            yesVotes: proposal.votes?.yes || 0,
            noVotes: proposal.votes?.no || 0
          });
        });
      }
    });
    
    return voteableProposals;
  };

  const value = {
    communities,
    joinCommunity,
    createCommunity,
    createProposal,
    voteOnProposal,
    getJoinedCommunities,
    getUserProposals,
    getUserVotes,
    getCommunityById,
    hasUserVoted,
    getUserVoteOnProposal,
    getAllVoteableProposals,
    userProposals,
    userVotes,
    account,
    isConnected
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};
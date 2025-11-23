import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';

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

  // Initialize mock data
  useEffect(() => {
    const mockCommunities = [
      {
        id: 1,
        name: 'DeFi Governance',
        description: 'Community focused on decentralized finance governance decisions and protocols.',
        members: 1250,
        proposals: [
          {
            id: 101,
            title: 'Increase staking rewards',
            description: 'Proposal to increase staking rewards from 5% to 7% APY',
            creator: '0x742d35cc6b4b8e3b43f8e6c8b6cb68cc8c6be8c9',
            votes: { yes: 245, no: 67 },
            endDate: '2024-12-15',
            status: 'active',
            communityId: 1,
            communityName: 'DeFi Governance'
          },
          {
            id: 102,
            title: 'New lending protocol',
            description: 'Launch a new lending protocol with 0% fees for first month',
            creator: '0x123d35cc6b4b8e3b43f8e6c8b6cb68cc8c6be123',
            votes: { yes: 189, no: 123 },
            endDate: '2024-12-20',
            status: 'active',
            communityId: 1,
            communityName: 'DeFi Governance'
          }
        ],
        category: 'defi',
        isJoined: false,
        image: '🏛️'
      },
      {
        id: 2,
        name: 'NFT Collectors',
        description: 'A community for NFT enthusiasts to govern marketplace decisions and curation.',
        members: 890,
        proposals: [
          {
            id: 201,
            title: 'Implement new royalty structure',
            description: 'Proposal to implement a 5% royalty fee for all NFT trades',
            creator: account || '0x456d35cc6b4b8e3b43f8e6c8b6cb68cc8c6be456',
            votes: { yes: 145, no: 23 },
            endDate: '2024-12-01',
            status: 'active',
            communityId: 2,
            communityName: 'NFT Collectors'
          },
          {
            id: 202,
            title: 'Add new NFT categories',
            description: 'Expand marketplace to include music and video NFTs',
            creator: '0x789d35cc6b4b8e3b43f8e6c8b6cb68cc8c6be789',
            votes: { yes: 89, no: 67 },
            endDate: '2024-11-28',
            status: 'ended',
            communityId: 2,
            communityName: 'NFT Collectors'
          }
        ],
        category: 'nft',
        isJoined: false,
        image: '🎨'
      },
      {
        id: 3,
        name: 'Environmental DAO',
        description: 'Focusing on environmental initiatives and sustainability projects.',
        members: 567,
        proposals: [
          {
            id: 301,
            title: 'Carbon offset program',
            description: 'Launch a carbon offset program for all community transactions',
            creator: '0x321d35cc6b4b8e3b43f8e6c8b6cb68cc8c6be321',
            votes: { yes: 234, no: 45 },
            endDate: '2024-12-10',
            status: 'active',
            communityId: 3,
            communityName: 'Environmental DAO'
          }
        ],
        category: 'environment',
        isJoined: false,
        image: '🌱'
      },
      {
        id: 4,
        name: 'Gaming DAO',
        description: 'Decentralized gaming community governance',
        members: 345,
        proposals: [
          {
            id: 401,
            title: 'Tournament prize pool distribution',
            description: 'How should we distribute the $10,000 prize pool for next tournament?',
            creator: account || '0x654d35cc6b4b8e3b43f8e6c8b6cb68cc8c6be654',
            votes: { option1: 45, option2: 32, option3: 28 },
            endDate: '2024-11-30',
            status: 'active',
            communityId: 4,
            communityName: 'Gaming DAO'
          }
        ],
        category: 'gaming',
        isJoined: false,
        image: '🎮'
      }
    ];

    setCommunities(mockCommunities);

    // Initialize empty user votes - no default votes
    if (isConnected && account) {
      setUserVotes([]);
    }
  }, [isConnected, account]);

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
  };

  const createCommunity = (newCommunity) => {
    if (!isConnected) {
      alert('Please connect your wallet to create communities');
      return false;
    }

    const community = {
      id: communities.length + 1,
      name: newCommunity.name,
      description: newCommunity.description,
      members: 1,
      proposals: [],
      category: newCommunity.category,
      isJoined: true,
      image: '🏛️'
    };

    setCommunities(prev => [...prev, community]);
    return true;
  };

  const createProposal = (communityId, proposal) => {
    if (!isConnected) {
      alert('Please connect your wallet to create proposals');
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
      communityName: communities.find(c => c.id === communityId)?.name || ''
    };

    setCommunities(prev =>
      prev.map(community =>
        community.id === communityId
          ? { ...community, proposals: [...community.proposals, newProposal] }
          : community
      )
    );

    setUserProposals(prev => [...prev, newProposal]);
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

    // Get the current proposal to update
    const currentCommunity = communities.find(c => c.id === communityId);
    const currentProposal = currentCommunity?.proposals.find(p => p.id === proposalId);
    
    if (!currentProposal) {
      alert('Proposal not found');
      return false;
    }

    // Update proposal vote count
    setCommunities(prev =>
      prev.map(community =>
        community.id === communityId
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

    // Add to user votes with updated proposal data
    const updatedProposal = {
      ...currentProposal,
      votes: {
        ...currentProposal.votes,
        [vote]: (currentProposal.votes[vote] || 0) + 1
      }
    };

    const newVote = {
      proposalId,
      vote,
      voter: account,
      voteDate: new Date().toISOString().split('T')[0],
      proposal: updatedProposal
    };
    
    setUserVotes(prev => [...prev, newVote]);

    return true;
  };

  const getJoinedCommunities = () => {
    return communities.filter(community => community.isJoined);
  };

  const getUserProposals = () => {
    if (!account) return [];
    
    const allProposals = communities.flatMap(community => 
      community.proposals.map(proposal => ({
        ...proposal,
        communityName: community.name
      }))
    );
    
    return allProposals.filter(proposal => proposal.creator === account);
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
    userProposals,
    userVotes
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};
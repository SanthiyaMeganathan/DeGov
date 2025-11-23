import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletContext';
import { DEGOV_CONTRACT_ABI, CONTRACT_ADDRESS } from '../contracts/DeGovContract.js';

const CommunityContext = createContext();

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

export const CommunityProvider = ({ children }) => {
  const { isConnected, account, provider, signer } = useWallet();
  const [communities, setCommunities] = useState([]);
  const [userProposals, setUserProposals] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);

  // Initialize contract when wallet connects
  useEffect(() => {
    if (provider && CONTRACT_ADDRESS) {
      try {
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          DEGOV_CONTRACT_ABI,
          provider
        );
        setContract(contractInstance);
        console.log('✅ Contract connected:', CONTRACT_ADDRESS);
      } catch (error) {
        console.error('❌ Contract connection error:', error);
      }
    }
  }, [provider]);

  // Load communities from blockchain when contract is ready
  useEffect(() => {
    if (contract) {
      loadCommunitiesFromBlockchain();
    }
  }, [contract]);

  // Load user data when account changes
  useEffect(() => {
    if (contract && account) {
      loadUserDataFromBlockchain();
    }
  }, [contract, account]);

  const loadCommunitiesFromBlockchain = async () => {
    if (!contract) return;
    
    setLoading(true);
    try {
      console.log('🔍 Loading communities from blockchain...');
      
      // Get community count
      const communityCount = await contract.communityCounter();
      console.log('📊 Total communities:', communityCount.toString());
      
      const communitiesData = [];
      
      for (let i = 1; i <= communityCount; i++) {
        try {
          const community = await contract.getCommunity(i);
          const memberCount = await contract.getCommunityMemberCount(i);
          
          // Parse metadata from metadataURI
          let description = 'No description available';
          let category = 'general';
          
          try {
            if (community.metadataURI) {
              const metadata = JSON.parse(community.metadataURI);
              description = metadata.description || description;
              category = metadata.category || category;
            }
          } catch (metadataError) {
            // If metadata is not JSON, treat metadataURI as description
            description = community.metadataURI || description;
          }
          
          communitiesData.push({
            id: i,
            name: community.name,
            description: description,
            creator: community.creator,
            members: memberCount.toNumber(),
            proposals: [], // Will load separately
            category: category,
            isJoined: false, // Will check separately
            image: getRandomEmoji()
          });
        } catch (error) {
          console.error(`Error loading community ${i}:`, error);
        }
      }
      
      setCommunities(communitiesData);
      console.log('✅ Loaded', communitiesData.length, 'communities');
      
    } catch (error) {
      console.error('❌ Error loading communities:', error);
      // Fallback to mock data if blockchain fails
      initializeMockCommunities();
    }
    setLoading(false);
  };

  const loadUserDataFromBlockchain = async () => {
    if (!contract || !account) return;
    
    try {
      console.log('👤 Loading user data for:', account);
      
      // Check which communities user has joined
      const updatedCommunities = await Promise.all(
        communities.map(async (community) => {
          try {
            const isMember = await contract.isMember(community.id, account);
            return { ...community, isJoined: isMember };
          } catch {
            return community;
          }
        })
      );
      
      setCommunities(updatedCommunities);
      
      // Load user's proposals and votes
      loadUserProposalsAndVotes();
      
    } catch (error) {
      console.error('❌ Error loading user data:', error);
    }
  };

  const loadUserProposalsAndVotes = async () => {
    if (!contract || !account) return;
    
    try {
      // This would depend on your contract's event structure
      // For now, we'll use a simplified approach
      setUserProposals([]);
      setUserVotes([]);
    } catch (error) {
      console.error('❌ Error loading user proposals/votes:', error);
    }
  };

  const createCommunity = async (communityData) => {
    if (!contract || !signer || !account) {
      alert('Please connect your wallet to create a community');
      return false;
    }

    try {
      setLoading(true);
      console.log('🏗️ Creating community:', communityData.name);
      
      const contractWithSigner = contract.connect(signer);
      
      // Create metadata object for the community
      const metadata = {
        description: communityData.description,
        category: communityData.category || 'general',
        createdAt: new Date().toISOString()
      };
      
      // For now, we'll use the description as metadataURI
      // In production, you'd upload metadata to IPFS and use the IPFS hash
      const metadataURI = JSON.stringify(metadata);
      
      const tx = await contractWithSigner.createCommunity(
        communityData.name,
        metadataURI
      );
      
      console.log('⏳ Transaction submitted:', tx.hash);
      await tx.wait();
      
      console.log('✅ Community created successfully!');
      
      // Reload communities
      await loadCommunitiesFromBlockchain();
      
      return true;
    } catch (error) {
      console.error('❌ Error creating community:', error);
      alert('Error creating community: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const joinCommunity = async (communityId) => {
    if (!contract || !signer || !account) {
      alert('Please connect your wallet to join communities');
      return;
    }

    try {
      setLoading(true);
      console.log('👥 Joining community:', communityId);
      
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.joinCommunity(communityId);
      
      console.log('⏳ Transaction submitted:', tx.hash);
      await tx.wait();
      
      console.log('✅ Successfully joined community!');
      
      // Update UI immediately
      setCommunities(prev =>
        prev.map(community =>
          community.id === communityId
            ? { ...community, isJoined: true, members: community.members + 1 }
            : community
        )
      );
      
    } catch (error) {
      console.error('❌ Error joining community:', error);
      alert('Error joining community: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async (proposalData) => {
    if (!contract || !signer || !account) {
      alert('Please connect your wallet to create proposals');
      return false;
    }

    try {
      setLoading(true);
      console.log('📝 Creating proposal:', proposalData.title);
      
      const contractWithSigner = contract.connect(signer);
      
      const endTime = Math.floor(Date.now() / 1000) + (proposalData.duration * 24 * 60 * 60);
      
      const tx = await contractWithSigner.createProposal(
        proposalData.communityId,
        proposalData.title,
        proposalData.description,
        endTime
      );
      
      console.log('⏳ Transaction submitted:', tx.hash);
      await tx.wait();
      
      console.log('✅ Proposal created successfully!');
      
      // Reload data
      await loadUserProposalsAndVotes();
      
      return true;
    } catch (error) {
      console.error('❌ Error creating proposal:', error);
      alert('Error creating proposal: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data if blockchain fails
  const initializeMockCommunities = () => {
    const mockCommunities = [
      {
        id: 1,
        name: 'DeFi Governance',
        description: 'Community focused on decentralized finance governance decisions.',
        members: 1250,
        proposals: [],
        category: 'defi',
        isJoined: false,
        image: '💰'
      },
      {
        id: 2,
        name: 'NFT Collectors',
        description: 'Digital art and NFT trading community.',
        members: 890,
        proposals: [],
        category: 'nft',
        isJoined: false,
        image: '🎨'
      }
    ];
    
    setCommunities(mockCommunities);
    console.log('⚠️ Using mock data - blockchain connection failed');
  };

  const getRandomEmoji = () => {
    const emojis = ['🚀', '💎', '🌟', '🔥', '⚡', '🎯', '💰', '🎨', '🌍', '🏆'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const value = {
    communities,
    userProposals,
    userVotes,
    loading,
    createCommunity,
    joinCommunity,
    createProposal,
    contract
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};
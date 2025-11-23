import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useCommunity } from '../context/CommunityContext';
import './Communities.css';

const Communities = () => {
  console.log('Communities component rendering...');
  
  const { isConnected } = useWallet();
  const { communities = [], joinCommunity, createCommunity, voteOnProposal, hasUserVoted, getUserVoteOnProposal } = useCommunity();
  
  console.log('Wallet connected:', isConnected);
  console.log('Communities from context:', communities);
  
  const [filteredCommunities, setFilteredCommunities] = useState(communities);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProposalsModal, setShowProposalsModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    category: 'governance'
  });
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All', emoji: '🌐' },
    { id: 'defi', label: 'DeFi', emoji: '💰' },
    { id: 'nft', label: 'NFT', emoji: '🎨' },
    { id: 'gaming', label: 'Gaming', emoji: '🎮' },
    { id: 'governance', label: 'Governance', emoji: '🏛️' },
    { id: 'environment', label: 'Environment', emoji: '🌱' }
  ];

  useEffect(() => {
    console.log('Communities data:', communities);
    console.log('Active filter:', activeFilter);
    
    let filtered;
    if (activeFilter === 'all') {
      filtered = communities;
    } else {
      filtered = communities.filter(c => c.category === activeFilter);
    }
    
    setFilteredCommunities(filtered);
    console.log('Setting filtered communities to:', filtered);
  }, [communities, activeFilter]);

  // Debug effect to track filteredCommunities changes
  useEffect(() => {
    console.log('filteredCommunities state updated:', filteredCommunities);
  }, [filteredCommunities]);

  const handleJoinCommunity = async (communityId) => {
    try {
      console.log('Attempting to join community:', communityId);
      await joinCommunity(communityId);
      console.log('Successfully joined community');
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Failed to join community. Please try again.');
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!newCommunity.name.trim() || !newCommunity.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      console.log('Creating community:', newCommunity);
      const success = await createCommunity(newCommunity);
      if (success) {
        setNewCommunity({ name: '', description: '', category: 'governance' });
        setShowCreateModal(false);
        alert('Community created successfully!');
      }
    } catch (error) {
      console.error('Error creating community:', error);
      alert('Failed to create community. Please try again.');
    }
  };

  const handleCommunityClick = (community) => {
    setSelectedCommunity(community);
    setShowProposalsModal(true);
  };

  const handleVoteOnProposal = async (proposalId, vote) => {
    try {
      if (selectedCommunity) {
        console.log('Voting on proposal:', proposalId, 'with vote:', vote, 'in community:', selectedCommunity.id);
        const success = await voteOnProposal(proposalId, vote, selectedCommunity.id);
        if (success) {
          // Update the selected community with the latest data from context
          const updatedCommunity = communities.find(c => c.id === selectedCommunity.id);
          setSelectedCommunity(updatedCommunity);
          alert(`Vote cast successfully! You voted ${vote.toUpperCase()} on this proposal.`);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert(error.message || 'Failed to vote on proposal');
    }
  };

  return (
    <div className="communities">
      <div className="communities-container">
        <div className="communities-header">
          <h1>Communities</h1>
          <p>Join communities and participate in decentralized governance</p>
          {isConnected && (
            <button 
              className="create-community-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + Create Community
            </button>
          )}
        </div>

        <div className="filters">
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(category.id)}
              >
                <span className="filter-emoji">{category.emoji}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="communities-grid">
          {filteredCommunities.length === 0 ? (
            <div className="no-communities">
              <p>No communities found for this category.</p>
              {isConnected && (
                <button 
                  className="create-community-btn"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create the first community
                </button>
              )}
            </div>
          ) : (
            filteredCommunities.map(community => {
              // Safety check for community structure
              if (!community) {
                console.error('Invalid community object:', community);
                return null;
              }
              
              return (
                <div key={community.id} className="community-card">
                  <div className="community-header">
                    <div className="community-avatar">{community.image || '🏛️'}</div>
                    <div className="community-info">
                      <h3 
                        className="community-name clickable"
                        onClick={() => handleCommunityClick(community)}
                        title="Click to view proposals"
                      >
                        {community.name}
                      </h3>
                      <span className="community-category">{community.category}</span>
                    </div>
                  </div>
                  
                  <p className="community-description">{community.description}</p>
                  
                  <div className="community-stats">
                    <div className="stat">
                      <span className="stat-number">{community.members}</span>
                      <span className="stat-label">Members</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{community.proposals?.length || 0}</span>
                      <span className="stat-label">Proposals</span>
                    </div>
                  </div>
                  
                  <button 
                    className={`join-btn ${community.isJoined ? 'joined' : ''}`}
                    onClick={() => handleJoinCommunity(community.id)}
                  >
                    {community.isJoined ? '✓ Joined' : 'Join Community'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Create Community Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create New Community</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateCommunity}>
                <div className="form-group">
                  <label htmlFor="community-name">Community Name</label>
                  <input
                    id="community-name"
                    type="text"
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
                    placeholder="Enter community name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="community-description">Description</label>
                  <textarea
                    id="community-description"
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                    placeholder="Describe your community"
                    rows="4"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="community-category">Category</label>
                  <select
                    id="community-category"
                    value={newCommunity.category}
                    onChange={(e) => setNewCommunity({...newCommunity, category: e.target.value})}
                  >
                    <option value="governance">Governance</option>
                    <option value="defi">DeFi</option>
                    <option value="nft">NFT</option>
                    <option value="gaming">Gaming</option>
                    <option value="environment">Environment</option>
                  </select>
                </div>
                
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary">
                    Create Community
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Proposals Modal */}
        {showProposalsModal && selectedCommunity && (
          <div className="modal-overlay">
            <div className="modal large-modal">
              <div className="modal-header">
                <h2>{selectedCommunity.name} - Proposals</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowProposalsModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="proposals-content">
                {selectedCommunity.proposals?.length > 0 ? (
                  <div className="proposals-list">
                    {selectedCommunity.proposals.map(proposal => {
                      // Safety check for proposal structure
                      if (!proposal) {
                        console.error('Invalid proposal object:', proposal);
                        return null;
                      }
                      
                      const userVote = getUserVoteOnProposal(proposal.id);
                      const hasVoted = hasUserVoted(proposal.id);
                      
                      return (
                        <div 
                          key={proposal.id} 
                          className={`proposal-item ${
                            hasVoted 
                              ? userVote === 'yes' 
                                ? 'voted-yes' 
                                : 'voted-no'
                              : ''
                          }`}
                        >
                          <h3>{proposal.title}</h3>
                          <p>{proposal.description}</p>
                          
                          <div className="proposal-stats">
                            <div className="vote-stats">
                              <div className="vote-option">
                                <span className="vote-count">{proposal.yesVotes || 0}</span>
                                <span className="vote-label">Yes</span>
                              </div>
                              <div className="vote-option">
                                <span className="vote-count">{proposal.noVotes || 0}</span>
                                <span className="vote-label">No</span>
                              </div>
                            </div>
                            <div className="proposal-meta">
                              <span className="proposal-status">{proposal.status}</span>
                              <span className="proposal-end">Ends: {proposal.endDate}</span>
                            </div>
                          </div>

                          {proposal.status === 'active' && (
                            <div className="voting-actions">
                              <button 
                                className={`vote-btn yes ${userVote === 'yes' ? 'voted' : ''}`}
                                onClick={() => handleVoteOnProposal(proposal.id, 'yes')}
                                disabled={hasVoted}
                              >
                                {userVote === 'yes' ? '✓ Voted Yes' : 'Vote Yes'}
                              </button>
                              <button 
                                className={`vote-btn no ${userVote === 'no' ? 'voted' : ''}`}
                                onClick={() => handleVoteOnProposal(proposal.id, 'no')}
                                disabled={hasVoted}
                              >
                                {userVote === 'no' ? '✓ Voted No' : 'Vote No'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-proposals">
                    <p>No proposals yet in this community.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Communities;
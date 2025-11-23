import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useCommunity } from '../context/CommunityContext';
import './MyCommunity.css';

const MyCommunity = () => {
  const { isConnected, account } = useWallet();
  const { communities, getJoinedCommunities, createProposal, voteOnProposal, hasUserVoted, getUserVoteOnProposal } = useCommunity();
  const [myCommunities, setMyCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    console.log('MyCommunity useEffect - isConnected:', isConnected, 'account:', account);
    if (isConnected && account) {
      const joinedCommunities = getJoinedCommunities();
      console.log('Joined communities:', joinedCommunities);
      setMyCommunities(joinedCommunities);
      if (joinedCommunities.length > 0 && !selectedCommunity) {
        setSelectedCommunity(joinedCommunities[0]);
      } else if (joinedCommunities.length === 0) {
        setSelectedCommunity(null);
      }
    } else if (!isConnected) {
      setMyCommunities([]);
      setSelectedCommunity(null);
    }
  }, [isConnected, account, communities, getJoinedCommunities]);

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    if (!selectedCommunity) {
      alert('Please select a community first');
      return;
    }
    
    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const success = await createProposal(selectedCommunity.id, newProposal);
      if (success) {
        setNewProposal({ title: '', description: '' });
        setShowProposalModal(false);
        // The communities state will automatically update via context
        // No need to manually refresh since useEffect will handle it
        alert('Proposal created successfully!');
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Failed to create proposal. Please try again.');
    }
  };

  const handleVote = async (proposalId, vote) => {
    if (!selectedCommunity) return;
    
    try {
      const success = await voteOnProposal(proposalId, vote, selectedCommunity.id);
      if (success) {
        // The communities state will automatically update via context
        // The useEffect will handle the refresh
        alert(`Vote cast successfully! You voted ${vote.toUpperCase()} on this proposal.`);
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert(error.message || 'Failed to vote on proposal');
    }
  };

  if (!isConnected) {
    return (
      <div className="my-community">
        <div className="my-community-container">
          <div className="connect-wallet-message">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your wallet to view your communities and participate in governance.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isConnected && myCommunities.length === 0) {
    return (
      <div className="my-community">
        <div className="my-community-container">
          <div className="no-communities">
            <h2>You are not a part of any community</h2>
            <p>You haven't joined any communities yet. Visit the Communities page to join or create one!</p>
            <a href="/communities" className="join-communities-btn">
              Browse Communities
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-community">
      <div className="my-community-container">
        <div className="my-community-header">
          <h1>My Communities</h1>
          <p>Manage your communities and participate in governance</p>
        </div>

        <div className="my-community-layout">
          {/* Community Sidebar */}
          <div className="community-sidebar">
            <h3>Your Communities</h3>
            <div className="community-list">
              {myCommunities.map(community => (
                <div
                  key={community.id}
                  className={`community-item ${selectedCommunity?.id === community.id ? 'active' : ''}`}
                  onClick={() => setSelectedCommunity(community)}
                >
                  <div className="community-avatar">{community.image}</div>
                  <div className="community-details">
                    <h4>{community.name}</h4>
                    <p>{community.members} members • {community.proposals?.length || 0} proposals</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="community-main">
            {selectedCommunity && (
              <>
                <div className="community-header">
                  <div className="community-info">
                    <div className="community-avatar-large">{selectedCommunity.image}</div>
                    <div>
                      <h2>{selectedCommunity.name}</h2>
                      <p>{selectedCommunity.description}</p>
                      <div className="community-stats">
                        <span>{selectedCommunity.members} members</span>
                        <span>{selectedCommunity.proposals?.length || 0} proposals</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="create-proposal-btn"
                    onClick={() => setShowProposalModal(true)}
                  >
                    + Create Proposal
                  </button>
                </div>

                <div className="proposals-section">
                  <h3>Active Proposals</h3>
                  {selectedCommunity.proposals && selectedCommunity.proposals.length > 0 ? (
                    <div className="proposals-list">
                      {selectedCommunity.proposals
                        .filter(proposal => proposal.status === 'active')
                        .map(proposal => {
                          const userVote = getUserVoteOnProposal(proposal.id);
                          const hasVoted = hasUserVoted(proposal.id);
                          
                          return (
                            <div 
                              key={proposal.id} 
                              className={`proposal-card ${
                                hasVoted 
                                  ? userVote === 'yes' 
                                    ? 'voted-yes' 
                                    : 'voted-no'
                                  : ''
                              }`}
                            >
                              <div className="proposal-header">
                                <h4>{proposal.title}</h4>
                                <span className={`status ${proposal.status}`}>{proposal.status}</span>
                              </div>
                              <p>{proposal.description}</p>
                              
                              {hasVoted && (
                                <div className={`vote-status ${userVote}`}>
                                  ✓ You voted: {userVote === 'yes' ? '👍 Yes' : '👎 No'}
                                </div>
                              )}
                              
                              <div className="proposal-footer">
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
                                <div className="proposal-actions">
                                  <span className="end-date">Ends: {proposal.endDate}</span>
                                  {!hasVoted && (
                                    <div className="vote-buttons">
                                      <button 
                                        className="vote-btn yes"
                                        onClick={() => handleVote(proposal.id, 'yes')}
                                      >
                                        Vote Yes
                                      </button>
                                      <button 
                                        className="vote-btn no"
                                        onClick={() => handleVote(proposal.id, 'no')}
                                      >
                                        Vote No
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="no-proposals">
                      <p>No active proposals in this community.</p>
                      <button 
                        className="create-first-proposal-btn"
                        onClick={() => setShowProposalModal(true)}
                      >
                        Create the first proposal
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Create Proposal Modal */}
        {showProposalModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create New Proposal</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowProposalModal(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateProposal}>
                <div className="form-group">
                  <label htmlFor="title">Proposal Title</label>
                  <input
                    type="text"
                    id="title"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                    placeholder="Enter proposal title..."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                    placeholder="Describe your proposal in detail..."
                    rows="6"
                  />
                </div>
                
                <div className="proposal-info">
                  <p>📝 <strong>Community:</strong> {selectedCommunity?.name}</p>
                  <p>⏰ <strong>Voting Period:</strong> 7 days</p>
                  <p>🎯 <strong>Required:</strong> Simple majority to pass</p>
                </div>
                
                <div className="modal-buttons">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowProposalModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Create Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCommunity;
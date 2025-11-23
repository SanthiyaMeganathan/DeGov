import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useCommunity } from '../context/CommunityContext';
import './MyProposals.css';

const MyProposals = () => {
  const { isConnected, account } = useWallet();
  const { getUserProposals, communities } = useCommunity();
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    console.log('MyProposals useEffect - isConnected:', isConnected, 'account:', account);
    if (isConnected && account) {
      const userProposalsList = getUserProposals();
      console.log('User proposals from context:', userProposalsList);
      console.log('Raw communities data:', communities);
      setProposals(userProposalsList);
    } else {
      setProposals([]);
    }
  }, [isConnected, account, communities, getUserProposals]); // Added communities dependency

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredProposals(proposals);
    } else {
      setFilteredProposals(proposals.filter(proposal => proposal.status === statusFilter));
    }
  }, [proposals, statusFilter]);

  const getProposalStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'ended': return '#f59e0b';
      case 'passed': return '#3b82f6';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const calculateVotePercentage = (proposal) => {
    const totalVotes = (proposal.yesVotes || 0) + (proposal.noVotes || 0);
    if (totalVotes === 0) return { yes: 0, no: 0 };
    
    const yesPercentage = ((proposal.yesVotes || 0) / totalVotes) * 100;
    const noPercentage = ((proposal.noVotes || 0) / totalVotes) * 100;
    
    return { 
      yes: Math.round(yesPercentage), 
      no: Math.round(noPercentage),
      total: totalVotes 
    };
  };

  const getProposalOutcome = (proposal) => {
    if (proposal.status !== 'ended') return null;
    
    const yesVotes = proposal.yesVotes || 0;
    const noVotes = proposal.noVotes || 0;
    
    if (yesVotes > noVotes) return 'passed';
    if (noVotes > yesVotes) return 'rejected';
    return 'tied';
  };

  if (!isConnected) {
    return (
      <div className="my-proposals">
        <div className="my-proposals-container">
          <div className="connect-wallet-message">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your wallet to view your proposals.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-proposals">
      <div className="my-proposals-container">
        <div className="my-proposals-header">
          <h1>My Proposals</h1>
          <p>Track all proposals you've created across communities</p>
        </div>

        <div className="filters-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({proposals.length})
            </button>
            <button
              className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active ({proposals.filter(p => p.status === 'active').length})
            </button>
            <button
              className={`filter-btn ${statusFilter === 'ended' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ended')}
            >
              Ended ({proposals.filter(p => p.status === 'ended').length})
            </button>
          </div>
        </div>

        {filteredProposals.length === 0 ? (
          <div className="no-proposals">
            {statusFilter === 'all' ? (
              <>
                <h3>No Proposals Yet</h3>
                <p>You haven't created any proposals yet. Join a community and create your first proposal!</p>
                <a href="/my-community" className="create-proposal-link">
                  Go to My Communities
                </a>
              </>
            ) : (
              <>
                <h3>No {statusFilter} Proposals</h3>
                <p>You don't have any {statusFilter} proposals at the moment.</p>
              </>
            )}
          </div>
        ) : (
          <div className="proposals-grid">
            {filteredProposals.map(proposal => {
              const voteStats = calculateVotePercentage(proposal);
              const outcome = getProposalOutcome(proposal);
              
              // Add some debugging for vote counts
              console.log('Rendering proposal:', proposal.title, 'Yes:', proposal.yesVotes, 'No:', proposal.noVotes);
              
              return (
                <div key={proposal.id} className="proposal-card">
                  <div className="proposal-header">
                    <div className="proposal-title-section">
                      <h3>{proposal.title}</h3>
                      <div className="proposal-meta">
                        <span className="community-name">📍 {proposal.communityName || 'Unknown Community'}</span>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getProposalStatusColor(proposal.status) }}
                        >
                          {proposal.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="proposal-description">{proposal.description}</p>

                  <div className="voting-section">
                    <div className="vote-stats">
                      <div className="vote-summary">
                        <div className="vote-count-header">
                          <h4>📊 Voting Activity</h4>
                          <span className="total-participation">{voteStats.total} total votes</span>
                        </div>
                        
                        <div className="vote-breakdown">
                          <div className="vote-option yes">
                            <div className="vote-icon">👍</div>
                            <div className="vote-details">
                              <span className="vote-label">Yes Votes</span>
                              <span className="vote-number">{proposal.yesVotes || 0}</span>
                              <span className="vote-percentage">{voteStats.yes}%</span>
                            </div>
                          </div>
                          
                          <div className="vote-option no">
                            <div className="vote-icon">👎</div>
                            <div className="vote-details">
                              <span className="vote-label">No Votes</span>
                              <span className="vote-number">{proposal.noVotes || 0}</span>
                              <span className="vote-percentage">{voteStats.no}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="vote-bar">
                        <div className="vote-bar-container">
                          <div 
                            className="vote-bar-yes"
                            style={{ width: `${voteStats.yes}%` }}
                            title={`${voteStats.yes}% Yes votes`}
                          ></div>
                          <div 
                            className="vote-bar-no"
                            style={{ width: `${voteStats.no}%` }}
                            title={`${voteStats.no}% No votes`}
                          ></div>
                        </div>
                        
                        {voteStats.total > 0 && (
                          <div className="participation-indicator">
                            <span className="participation-text">
                              {voteStats.total === 1 ? '1 person has voted' : `${voteStats.total} people have voted`}
                            </span>
                            {proposal.status === 'active' && (
                              <span className="voting-live">🔴 Live</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="proposal-footer">
                    <div className="timeline-info">
                      <span className="end-date">
                        ⏰ Ends: {proposal.endDate}
                      </span>
                      {outcome && (
                        <span className={`outcome ${outcome}`}>
                          {outcome === 'passed' && '✅ Passed'}
                          {outcome === 'rejected' && '❌ Rejected'}
                          {outcome === 'tied' && '⚖️ Tied'}
                        </span>
                      )}
                    </div>
                    
                    {proposal.status === 'active' && (
                      <div className="time-remaining">
                        <span className="active-indicator">🔴 Voting active</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {proposals.length > 0 && (
          <div className="proposals-summary">
            <h3>Summary</h3>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-number">{proposals.length}</span>
                <span className="stat-label">Total Proposals</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">{proposals.filter(p => p.status === 'active').length}</span>
                <span className="stat-label">Currently Active</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">
                  {proposals.filter(p => getProposalOutcome(p) === 'passed').length}
                </span>
                <span className="stat-label">Passed</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">
                  {proposals.filter(p => getProposalOutcome(p) === 'rejected').length}
                </span>
                <span className="stat-label">Rejected</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProposals;
import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useCommunity } from '../context/CommunityContext';
import './MyVotes.css';

const MyVotes = () => {
  const { isConnected, account } = useWallet();
  const { getUserVotes } = useCommunity();
  const [votes, setVotes] = useState([]);
  const [filteredVotes, setFilteredVotes] = useState([]);
  const [outcomeFilter, setOutcomeFilter] = useState('all');

  useEffect(() => {
    if (isConnected && account) {
      const userVotes = getUserVotes();
      setVotes(userVotes);
    }
  }, [isConnected, account, getUserVotes]);

  useEffect(() => {
    if (outcomeFilter === 'all') {
      setFilteredVotes(votes);
    } else {
      setFilteredVotes(votes.filter(vote => {
        const outcome = getVoteOutcome(vote);
        return outcome === outcomeFilter;
      }));
    }
  }, [votes, outcomeFilter]);

  const getVoteOutcome = (vote) => {
    const proposal = vote.proposal;
    
    // Handle cases where proposal data might be undefined or incomplete
    if (!proposal) return 'pending';
    if (!proposal.status || proposal.status !== 'ended') return 'pending';
    
    const yesVotes = proposal.yesVotes || 0;
    const noVotes = proposal.noVotes || 0;
    
    if (yesVotes === noVotes) return 'tied';
    
    const proposalPassed = yesVotes > noVotes;
    const userVotedYes = vote.vote === 'yes';
    
    if ((proposalPassed && userVotedYes) || (!proposalPassed && !userVotedYes)) {
      return 'won';
    } else {
      return 'lost';
    }
  };

  const getVoteStats = () => {
    const totalVotes = votes.length;
    const wonVotes = votes.filter(vote => getVoteOutcome(vote) === 'won').length;
    const lostVotes = votes.filter(vote => getVoteOutcome(vote) === 'lost').length;
    const pendingVotes = votes.filter(vote => getVoteOutcome(vote) === 'pending').length;
    const tiedVotes = votes.filter(vote => getVoteOutcome(vote) === 'tied').length;
    
    const winRate = totalVotes > 0 ? ((wonVotes / (wonVotes + lostVotes)) * 100) : 0;
    
    return {
      total: totalVotes,
      won: wonVotes,
      lost: lostVotes,
      pending: pendingVotes,
      tied: tiedVotes,
      winRate: Math.round(winRate)
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'won': return '🎉';
      case 'lost': return '😔';
      case 'tied': return '⚖️';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'won': return '#10b981';
      case 'lost': return '#ef4444';
      case 'tied': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (!isConnected) {
    return (
      <div className="my-votes">
        <div className="my-votes-container">
          <div className="connect-wallet-message">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your wallet to view your voting history.</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = getVoteStats();

  return (
    <div className="my-votes">
      <div className="my-votes-container">
        <div className="my-votes-header">
          <h1>My Votes</h1>
          <p>Track your voting history and see how your decisions performed</p>
        </div>

        {votes.length > 0 && (
          <div className="voting-stats">
            <div className="stats-grid">
              <div className="stat-card total">
                <div className="stat-icon">🗳️</div>
                <div className="stat-content">
                  <span className="stat-number">{stats.total}</span>
                  <span className="stat-label">Total Votes</span>
                </div>
              </div>
              
              <div className="stat-card won">
                <div className="stat-icon">🎉</div>
                <div className="stat-content">
                  <span className="stat-number">{stats.won}</span>
                  <span className="stat-label">Won</span>
                </div>
              </div>
              
              <div className="stat-card lost">
                <div className="stat-icon">😔</div>
                <div className="stat-content">
                  <span className="stat-number">{stats.lost}</span>
                  <span className="stat-label">Lost</span>
                </div>
              </div>
              
              <div className="stat-card win-rate">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <span className="stat-number">{stats.winRate}%</span>
                  <span className="stat-label">Win Rate</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="filters-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${outcomeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setOutcomeFilter('all')}
            >
              All ({votes.length})
            </button>
            <button
              className={`filter-btn ${outcomeFilter === 'won' ? 'active' : ''}`}
              onClick={() => setOutcomeFilter('won')}
            >
              Won ({stats.won})
            </button>
            <button
              className={`filter-btn ${outcomeFilter === 'lost' ? 'active' : ''}`}
              onClick={() => setOutcomeFilter('lost')}
            >
              Lost ({stats.lost})
            </button>
            <button
              className={`filter-btn ${outcomeFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setOutcomeFilter('pending')}
            >
              Pending ({stats.pending})
            </button>
          </div>
        </div>

        {filteredVotes.length === 0 ? (
          <div className="no-votes">
            {outcomeFilter === 'all' ? (
              <>
                <h3>No Votes Yet</h3>
                <p>You haven't voted on any proposals yet. Join communities and start participating in governance!</p>
                <a href="/communities" className="vote-link">
                  Browse Communities
                </a>
              </>
            ) : (
              <>
                <h3>No {outcomeFilter} Votes</h3>
                <p>You don't have any {outcomeFilter} votes at the moment.</p>
              </>
            )}
          </div>
        ) : (
          <div className="votes-list">
            {filteredVotes.map((vote, index) => {
              const outcome = getVoteOutcome(vote);
              const proposal = vote.proposal;
              
              // Safety check: skip votes without proper proposal data
              if (!proposal) {
                return null;
              }
              
              return (
                <div key={`${vote.proposalId}-${index}`} className="vote-card">
                  <div className="vote-header">
                    <div className="proposal-info">
                      <h3>{proposal.title}</h3>
                      <span className="community-name">📍 {proposal.communityName}</span>
                    </div>
                    <div className="vote-outcome">
                      <span 
                        className="outcome-badge"
                        style={{ backgroundColor: getOutcomeColor(outcome) }}
                      >
                        {getOutcomeIcon(outcome)} {outcome}
                      </span>
                    </div>
                  </div>

                  <p className="proposal-description">{proposal.description}</p>

                  <div className="vote-details">
                    <div className="vote-info">
                      <div className="user-vote">
                        <span className="vote-label">Your Vote:</span>
                        <span className={`vote-choice ${vote.vote}`}>
                          {vote.vote === 'yes' ? '👍 Yes' : '👎 No'}
                        </span>
                      </div>
                      <div className="vote-date">
                        <span className="vote-label">Voted on:</span>
                        <span>{formatDate(vote.voteDate)}</span>
                      </div>
                    </div>

                    <div className="proposal-results">
                      <div className="results-header">Final Results:</div>
                      <div className="results-stats">
                        <div className="result-item">
                          <span className="result-label">Yes:</span>
                          <span className="result-count">{proposal.yesVotes || 0}</span>
                        </div>
                        <div className="result-item">
                          <span className="result-label">No:</span>
                          <span className="result-count">{proposal.noVotes || 0}</span>
                        </div>
                        <div className="result-item">
                          <span className="result-label">Total:</span>
                          <span className="result-count">
                            {(proposal.yesVotes || 0) + (proposal.noVotes || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {outcome === 'won' && (
                    <div className="outcome-message success">
                      🎉 Great choice! Your vote was on the winning side.
                    </div>
                  )}
                  
                  {outcome === 'lost' && (
                    <div className="outcome-message failure">
                      😔 Your side didn't win this time, but every vote counts!
                    </div>
                  )}
                  
                  {outcome === 'tied' && (
                    <div className="outcome-message neutral">
                      ⚖️ This proposal ended in a tie. Your voice was heard!
                    </div>
                  )}
                  
                  {outcome === 'pending' && (
                    <div className="outcome-message pending">
                      ⏳ Voting is still active. Results pending...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {votes.length > 0 && (
          <div className="participation-summary">
            <h3>Your Participation</h3>
            <div className="participation-stats">
              <p>
                🎯 You've participated in governance across{' '}
                <strong>{new Set(votes.map(v => v.proposal.communityName)).size}</strong> communities
              </p>
              <p>
                📊 Your voting accuracy is <strong>{stats.winRate}%</strong>{' '}
                {stats.winRate >= 70 && '- Excellent political instincts!'}
                {stats.winRate >= 50 && stats.winRate < 70 && '- Good judgment overall!'}
                {stats.winRate < 50 && '- Keep learning and improving!'}
              </p>
              <p>
                🏆 You're helping shape the future of decentralized governance!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVotes;
// Smart Contract Integration for DeGov Platform
// CommunityDAO contract deployed on blockchain

// Contract address
export const CONTRACT_ADDRESS = "0x8b582a90B92e689D53c249d3cB55AD878571E490";

// Your deployed contract ABI
export const DEGOV_CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "communityId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "CommunityCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "communityId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "member",
        "type": "address"
      }
    ],
    "name": "CommunityJoined",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "communityId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "ProposalCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "support",
        "type": "bool"
      }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "communities",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "memberCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      }
    ],
    "name": "createCommunity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "communityId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "votingPeriod",
        "type": "uint256"
      }
    ],
    "name": "createProposal",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCommunitiesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "communityId",
        "type": "uint256"
      }
    ],
    "name": "getCommunity",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "memberCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct CommunityDAO.Community",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "communityId",
        "type": "uint256"
      }
    ],
    "name": "getCommunityProposalIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      }
    ],
    "name": "getProposal",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "communityId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "yesVotes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "noVotes",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "executed",
            "type": "bool"
          }
        ],
        "internalType": "struct CommunityDAO.Proposal",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserCommunityIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserProposalIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserVoteIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "communityId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isCommunityMember",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isMember",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "communityId",
        "type": "uint256"
      }
    ],
    "name": "joinCommunity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "proposals",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "communityId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "yesVotes",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "noVotes",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "executed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "support",
        "type": "bool"
      }
    ],
    "name": "voteOnProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Your deployed contract address on Arbitrum
export const DEGOV_CONTRACT_ADDRESS = "0x8b582a90B92e689D53c249d3cB55AD878571E490";

// Arbitrum network configuration
export const ARBITRUM_NETWORK_CONFIG = {
  chainId: '0xa4b1', // 42161 in hex
  chainName: 'Arbitrum One',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  blockExplorerUrls: ['https://arbiscan.io/'],
};

// Contract interaction functions
import { ethers } from 'ethers';

export class DeGovContract {
  constructor(signer) {
    this.contract = new ethers.Contract(
      DEGOV_CONTRACT_ADDRESS,
      DEGOV_CONTRACT_ABI,
      signer
    );
  }

  // Community functions
  async createCommunity(name, description) {
    try {
      const metadataURI = JSON.stringify({ description, category: 'governance' }); // Store description as metadata
      const tx = await this.contract.createCommunity(name, metadataURI);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error creating community:', error);
      throw error;
    }
  }

  async joinCommunity(communityId) {
    try {
      const tx = await this.contract.joinCommunity(communityId);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error joining community:', error);
      throw error;
    }
  }

  async getAllCommunities() {
    try {
      const count = await this.contract.getCommunitiesCount();
      const communities = [];
      
      for (let i = 0; i < count; i++) {
        const community = await this.contract.getCommunity(i);
        let metadata = { description: '', category: 'governance' };
        try {
          metadata = JSON.parse(community.metadataURI);
        } catch (e) {
          metadata.description = community.metadataURI; // Fallback if not JSON
        }
        
        communities.push({
          id: community.id.toNumber(),
          name: community.name,
          description: metadata.description,
          category: metadata.category || 'governance',
          creator: community.creator,
          createdAt: new Date(community.createdAt.toNumber() * 1000),
          members: community.memberCount.toNumber(),
          proposals: 0 // Will be fetched separately if needed
        });
      }
      
      return communities;
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw error;
    }
  }

  async getUserCommunities(userAddress) {
    try {
      const communityIds = await this.contract.getUserCommunityIds(userAddress);
      const communities = [];
      
      for (let id of communityIds) {
        const community = await this.contract.getCommunity(id.toNumber());
        let metadata = { description: '', category: 'governance' };
        try {
          metadata = JSON.parse(community.metadataURI);
        } catch (e) {
          metadata.description = community.metadataURI;
        }
        
        communities.push({
          id: community.id.toNumber(),
          name: community.name,
          description: metadata.description,
          category: metadata.category || 'governance',
          creator: community.creator,
          createdAt: new Date(community.createdAt.toNumber() * 1000),
          members: community.memberCount.toNumber()
        });
      }
      
      return communities;
    } catch (error) {
      console.error('Error fetching user communities:', error);
      throw error;
    }
  }

  async isCommunityMember(communityId, userAddress) {
    try {
      return await this.contract.isCommunityMember(communityId, userAddress);
    } catch (error) {
      console.error('Error checking membership:', error);
      throw error;
    }
  }

  // Proposal functions
  async createProposal(communityId, title, description, votingPeriodDays = 7) {
    try {
      const votingPeriodSeconds = votingPeriodDays * 24 * 60 * 60; // Convert days to seconds
      const tx = await this.contract.createProposal(
        communityId, 
        title, 
        description, 
        votingPeriodSeconds
      );
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }

  async getProposal(proposalId) {
    try {
      const proposal = await this.contract.getProposal(proposalId);
      return {
        id: proposal.id.toNumber(),
        communityId: proposal.communityId.toNumber(),
        title: proposal.title,
        description: proposal.description,
        creator: proposal.creator,
        createdAt: new Date(proposal.createdAt.toNumber() * 1000),
        deadline: new Date(proposal.deadline.toNumber() * 1000),
        yesVotes: proposal.yesVotes.toNumber(),
        noVotes: proposal.noVotes.toNumber(),
        executed: proposal.executed,
        isActive: proposal.deadline.toNumber() * 1000 > Date.now() && !proposal.executed
      };
    } catch (error) {
      console.error('Error fetching proposal:', error);
      throw error;
    }
  }

  async getUserProposals(userAddress) {
    try {
      const proposalIds = await this.contract.getUserProposalIds(userAddress);
      const proposals = [];
      
      for (let id of proposalIds) {
        const proposal = await this.getProposal(id.toNumber());
        proposals.push(proposal);
      }
      
      return proposals;
    } catch (error) {
      console.error('Error fetching user proposals:', error);
      throw error;
    }
  }

  async getProposalsByCommunity(communityId) {
    try {
      const proposalIds = await this.contract.getCommunityProposalIds(communityId);
      const proposals = [];
      
      for (let id of proposalIds) {
        const proposal = await this.getProposal(id.toNumber());
        proposals.push(proposal);
      }
      
      return proposals;
    } catch (error) {
      console.error('Error fetching community proposals:', error);
      throw error;
    }
  }

  // Voting functions
  async voteOnProposal(proposalId, support) {
    try {
      const tx = await this.contract.voteOnProposal(proposalId, support);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error voting on proposal:', error);
      throw error;
    }
  }

  async hasVoted(proposalId, userAddress) {
    try {
      return await this.contract.hasVoted(proposalId, userAddress);
    } catch (error) {
      console.error('Error checking if user has voted:', error);
      throw error;
    }
  }

  async getUserVotes(userAddress) {
    try {
      const voteIds = await this.contract.getUserVoteIds(userAddress);
      const votes = [];
      
      for (let proposalId of voteIds) {
        const proposal = await this.getProposal(proposalId.toNumber());
        const community = await this.contract.getCommunity(proposal.communityId);
        
        votes.push({
          proposalId: proposalId.toNumber(),
          proposal: proposal,
          communityName: community.name,
          voteDate: proposal.createdAt, // Approximation - actual vote date would need to be tracked separately
        });
      }
      
      return votes;
    } catch (error) {
      console.error('Error fetching user votes:', error);
      throw error;
    }
  }

  // Utility functions
  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Event listening
  onCommunityCreated(callback) {
    this.contract.on('CommunityCreated', (communityId, name, metadataURI, creator) => {
      callback({
        communityId: communityId.toNumber(),
        name,
        metadataURI,
        creator
      });
    });
  }

  onCommunityJoined(callback) {
    this.contract.on('CommunityJoined', (communityId, member) => {
      callback({
        communityId: communityId.toNumber(),
        member
      });
    });
  }

  onProposalCreated(callback) {
    this.contract.on('ProposalCreated', (proposalId, communityId, title, creator, deadline) => {
      callback({
        proposalId: proposalId.toNumber(),
        communityId: communityId.toNumber(),
        title,
        creator,
        deadline: new Date(deadline.toNumber() * 1000)
      });
    });
  }

  onVoted(callback) {
    this.contract.on('Voted', (proposalId, voter, support) => {
      callback({
        proposalId: proposalId.toNumber(),
        voter,
        support
      });
    });
  }

  // Clean up event listeners
  removeAllListeners() {
    this.contract.removeAllListeners();
  }
}

// Example Solidity contract structure for reference:
/*
pragma solidity ^0.8.0;

contract DeGov {
    struct Community {
        uint256 id;
        string name;
        string description;
        address creator;
        uint256 memberCount;
        mapping(address => bool) members;
    }
    
    struct Proposal {
        uint256 id;
        uint256 communityId;
        string title;
        string description;
        address proposer;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    mapping(uint256 => Community) public communities;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256[]) public userCommunities;
    mapping(address => uint256[]) public userProposals;
    mapping(address => uint256[]) public userVotes;
    
    uint256 public communityCount;
    uint256 public proposalCount;
    
    event CommunityCreated(uint256 indexed communityId, string name, address creator);
    event MemberJoined(uint256 indexed communityId, address member);
    event ProposalCreated(uint256 indexed proposalId, uint256 communityId, string title, address proposer);
    event VoteCasted(uint256 indexed proposalId, address voter, bool support);
    
    function createCommunity(string memory _name, string memory _description) external {
        // Implementation here
    }
    
    function joinCommunity(uint256 _communityId) external {
        // Implementation here
    }
    
    function createProposal(uint256 _communityId, string memory _title, string memory _description) external {
        // Implementation here
    }
    
    function vote(uint256 _proposalId, bool _support) external {
        // Implementation here
    }
}
*/

export { CONTRACT_ADDRESS, CONTRACT_ABI };
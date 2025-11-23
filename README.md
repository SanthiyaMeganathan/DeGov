# DeGov - Decentralized Governance Platform

A decentralized governance platform built for the Arbitrum hackathon, enabling communities to create proposals, vote, and participate in democratic decision-making processes.

## 🌟 Features

### For All Users (Without Wallet)
- **Browse Communities**: View all available communities and their basic information
- **Community Details**: See community descriptions, member counts, and proposal statistics

### For Connected Users (With MetaMask Wallet)
- **Join Communities**: Connect your wallet to join any community
- **Create Communities**: Start new communities with custom names and descriptions
- **Create Proposals**: Submit proposals within communities you're part of
- **Vote on Proposals**: Cast votes on active proposals
- **My Community**: Manage communities you've joined and track their activity
- **My Proposals**: Monitor all proposals you've created across communities
- **My Votes**: Review your complete voting history and track outcomes

## 🚀 Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Vanilla CSS with modern responsive design
- **Blockchain**: Arbitrum (Layer 2 Ethereum)
- **Smart Contract Development**: Hardhat framework
- **Contract Deployment**: Remix IDE with injected MetaMask
- **Wallet Integration**: MetaMask via ethers.js v5.7.2
- **Routing**: React Router DOM
- **State Management**: React Context API

## 📱 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header with wallet connection
│   └── WalletButton.jsx # Wallet connect/disconnect button
├── pages/              # Main application pages
│   ├── Home.jsx        # Landing page with features overview
│   ├── Communities.jsx # Browse and create communities
│   ├── MyCommunity.jsx # User's joined communities management
│   ├── MyProposals.jsx # User's created proposals tracking
│   └── MyVotes.jsx     # User's voting history
├── context/            # React context for state management
│   ├── WalletContext.jsx # Wallet connection and blockchain state
│   └── CommunityContext.jsx # Community and proposal data management
├── contracts/          # Smart contract integration
│   └── DeGovContract.js # Contract ABI and interaction functions
└── styles/             # CSS modules and component styles
```

## 🔧 Development Tools Used

### Frontend Development
- **React 18**: Latest React features with concurrent rendering
- **Vite**: Fast build tool with hot module replacement
- **ESLint**: Code linting and formatting
- **CSS3**: Modern responsive design with Grid and Flexbox

### Blockchain Development
- **Hardhat**: Smart contract development framework
- **Remix IDE**: Web-based IDE for contract deployment
- **MetaMask**: Injected provider for wallet connection
- **ethers.js**: Ethereum library for blockchain interactions
- **Arbitrum**: Layer 2 scaling solution for lower gas costs

### Testing & Deployment
- **Browser Testing**: Manual testing with MetaMask integration
- **Network Testing**: Arbitrum testnet and mainnet validation
- **Static Deployment**: Ready for Vercel, Netlify, or similar platforms

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Access to Arbitrum network

### Installation

1. **Clone and setup the project**:
```bash
cd frontend-degov
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser and navigate to**: `http://localhost:5173`

### Smart Contract Integration

**Development Process:**
1. Smart contracts were developed using **Hardhat** framework
2. Contracts compiled and tested in Hardhat environment
3. Deployed to **Arbitrum network** using **Remix IDE** with **injected MetaMask**

To connect your own deployed contract:

1. **Deploy your contract** using Remix IDE:
   - Open [Remix IDE](https://remix.ethereum.org)
   - Connect MetaMask with **"Injected Provider - MetaMask"**
   - Ensure MetaMask is connected to **Arbitrum network**
   - Deploy your CommunityDAO contract
   - Copy the deployed contract address

2. **Update contract configuration** in `src/contracts/DeGovContract.js`:
   ```javascript
   // Replace with your actual contract address
   export const DEGOV_CONTRACT_ADDRESS = "0x8b582a90B92e689D53c249d3cB55AD878571E490";
   
   // The complete CommunityDAO ABI is already integrated
   export const DEGOV_CONTRACT_ABI = [
     // Full ABI with all functions included
   ];
   ```

3. **Contract Functions** (implemented in CommunityDAO):
   ```solidity
   // Core community functions
   function createCommunity(string memory name, string memory metadataURI) external;
   function joinCommunity(uint256 communityId) external;
   function getCommunity(uint256 communityId) external view;
   function getUserCommunityIds(address user) external view;
   
   // Proposal functions
   function createProposal(uint256 communityId, string memory title, string memory description, uint256 votingPeriod) external;
   function voteOnProposal(uint256 proposalId, bool support) external;
   function getProposal(uint256 proposalId) external view;
   function getUserProposalIds(address user) external view;
   
   // Additional functions for data retrieval and governance
   ```

## 🎯 Usage Guide

### 1. Connect Your Wallet
- Click "Connect Wallet" in the header
- Approve MetaMask connection
- Switch to Arbitrum network (automatic prompt if needed)

### 2. Explore Communities
- Visit the "Communities" page
- Browse available communities
- Filter by categories (DeFi, NFT, Environment, etc.)

### 3. Join and Participate
- Click "Join" on any community (wallet required)
- Create proposals within your communities
- Vote on active proposals
- Track your participation in dashboard pages

### 4. Governance Features
- **Proposal Creation**: Submit ideas with title and description
- **Democratic Voting**: Cast yes/no votes on proposals
- **Transparent Results**: View real-time voting statistics
- **Community Management**: Track membership and activity

## 🔧 Development Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized layouts
- Touch-friendly interface

### Accessibility
- Proper semantic HTML
- Keyboard navigation support
- Screen reader compatible
- High contrast color scheme

### Performance
- Optimized bundle size with Vite
- Lazy loading for better performance
- Efficient state management

## 📜 Smart Contract Details

**Deployed Contract Information:**
- **Contract Address**: `0x8b582a90B92e689D53c249d3cB55AD878571E490`
- **Network**: Arbitrum One (Chain ID: 42161)
- **Contract Name**: CommunityDAO
- **Deployment Tool**: Remix IDE with MetaMask injection
- **Development Framework**: Hardhat

**Key Features Implemented:**
- Community creation and management
- Proposal submission and voting
- Member management and access control
- Event emission for frontend synchronization
- Gas-optimized functions for Arbitrum L2

## 🌐 Network Configuration

The platform is configured for **Arbitrum One** network:
- Chain ID: 42161 (0xa4b1)
- RPC URL: https://arb1.arbitrum.io/rpc
- Block Explorer: https://arbiscan.io/

## 🛠️ Development Workflow

### Smart Contract Development Process

1. **Contract Development**:
   - Smart contracts developed using **Hardhat** framework
   - Local testing and compilation with Hardhat
   - Solidity version: ^0.8.0

2. **Deployment Process**:
   - Open [Remix IDE](https://remix.ethereum.org)
   - Import compiled contracts from Hardhat
   - Connect using **"Injected Provider - MetaMask"**
   - Ensure MetaMask connected to **Arbitrum network**
   - Deploy CommunityDAO contract
   - Verify deployment on [Arbiscan](https://arbiscan.io/)

3. **Frontend Integration**:
   - Update contract address in `src/contracts/DeGovContract.js`
   - ABI automatically imported from Hardhat compilation
   - Test contract interactions via MetaMask

### Local Development Setup
```bash
# Clone repository
git clone <repository-url>
cd frontend-degov

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📦 Build and Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files will be in the `dist/` directory and can be deployed to:
- **Vercel** (Recommended for this project)
- **Netlify** 
- **GitHub Pages**
- **IPFS**
- Any static hosting service

### Environment Variables (Optional)
Create a `.env` file for configuration:
```
VITE_CONTRACT_ADDRESS=0x8b582a90B92e689D53c249d3cB55AD878571E490
VITE_NETWORK_RPC=https://arb1.arbitrum.io/rpc
```

## 🤝 Contributing

This project was built for the Arbitrum hackathon. Feel free to:
1. Fork the repository
2. Create feature branches
3. Submit pull requests
4. Report issues

## 📄 License

MIT License - feel free to use this code for your own projects.

## 🔗 Links

- **Live Demo**: [Your deployment URL]
- **Smart Contract**: [Arbitrum block explorer link]
- **Arbitrum Docs**: https://docs.arbitrum.io/

## 🎊 Hackathon Submission

This project demonstrates:
- ✅ Arbitrum L2 integration
- ✅ MetaMask wallet connectivity
- ✅ Smart contract interactions
- ✅ Decentralized governance mechanisms
- ✅ Modern React/Web3 development patterns
- ✅ Responsive and accessible UI design

Built with ❤️ for the Arbitrum community!

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Simple Community + Proposal + Voting system for Arbitrum
/// @notice Wallet-based membership; no tokens needed.
contract CommunityDAO {
    // ============ Structs ============

    struct Community {
        uint256 id;
        string name;
        string metadataURI; // optional: description / image / off-chain data
        address creator;
        uint256 createdAt;
        uint256 memberCount;
    }

    struct Proposal {
        uint256 id;
        uint256 communityId;
        string title;
        string description;
        address creator;
        uint256 createdAt;
        uint256 deadline; // timestamp until which voting is allowed
        uint256 yesVotes;
        uint256 noVotes;
        bool executed; // placeholder for future on-chain actions
    }

    // ============ Storage ============

    Community[] public communities;
    Proposal[] public proposals;

    // communityId => (user => isMember)
    mapping(uint256 => mapping(address => bool)) public isMember;

    // user => communityIds they joined
    mapping(address => uint256[]) private userCommunities;

    // communityId => proposalIds
    mapping(uint256 => uint256[]) private communityProposals;

    // proposalId => (user => hasVoted)
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // user => proposalIds created by that user
    mapping(address => uint256[]) private userProposals;

    // user => proposalIds they voted on
    mapping(address => uint256[]) private userVotes;

    // ============ Events ============

    event CommunityCreated(
        uint256 indexed communityId,
        string name,
        string metadataURI,
        address indexed creator
    );

    event CommunityJoined(
        uint256 indexed communityId,
        address indexed member
    );

    event ProposalCreated(
        uint256 indexed proposalId,
        uint256 indexed communityId,
        string title,
        address indexed creator,
        uint256 deadline
    );

    event Voted(
        uint256 indexed proposalId,
        address indexed voter,
        bool support
    );

    // ============ Modifiers ============

    modifier communityExists(uint256 communityId) {
        require(communityId < communities.length, "Community: not found");
        _;
    }

    modifier proposalExists(uint256 proposalId) {
        require(proposalId < proposals.length, "Proposal: not found");
        _;
    }

    // ============ Core Logic ============

    /// @notice Create a new community. Anyone can create.
    /// @param name human-readable name
    /// @param metadataURI off-chain metadata pointer (IPFS / URL / empty)
    function createCommunity(
        string calldata name,
        string calldata metadataURI
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name required");

        uint256 communityId = communities.length;

        communities.push(
            Community({
                id: communityId,
                name: name,
                metadataURI: metadataURI,
                creator: msg.sender,
                createdAt: block.timestamp,
                memberCount: 0
            })
        );

        emit CommunityCreated(communityId, name, metadataURI, msg.sender);

        // auto-join creator as member for convenience
        _joinCommunity(communityId, msg.sender);

        return communityId;
    }

    /// @notice Join an existing community.
    function joinCommunity(uint256 communityId)
        external
        communityExists(communityId)
    {
        _joinCommunity(communityId, msg.sender);
    }

    function _joinCommunity(uint256 communityId, address user) internal {
        require(!isMember[communityId][user], "Already member");

        isMember[communityId][user] = true;
        communities[communityId].memberCount += 1;
        userCommunities[user].push(communityId);

        emit CommunityJoined(communityId, user);
    }

    /// @notice Create a proposal in a community you are a member of.
    /// @param communityId target community
    /// @param title short title
    /// @param description long text / IPFS hash / etc.
    /// @param votingPeriod duration in seconds from now (e.g. 3 days = 3*24*60*60)
    function createProposal(
        uint256 communityId,
        string calldata title,
        string calldata description,
        uint256 votingPeriod
    ) external communityExists(communityId) returns (uint256) {
        require(isMember[communityId][msg.sender], "Not a community member");
        require(bytes(title).length > 0, "Title required");
        require(votingPeriod > 0, "Voting period must be > 0");
        require(votingPeriod <= 30 days, "Voting period too long");

        uint256 proposalId = proposals.length;
        uint256 deadline = block.timestamp + votingPeriod;

        proposals.push(
            Proposal({
                id: proposalId,
                communityId: communityId,
                title: title,
                description: description,
                creator: msg.sender,
                createdAt: block.timestamp,
                deadline: deadline,
                yesVotes: 0,
                noVotes: 0,
                executed: false
            })
        );

        communityProposals[communityId].push(proposalId);
        userProposals[msg.sender].push(proposalId);

        emit ProposalCreated(proposalId, communityId, title, msg.sender, deadline);

        return proposalId;
    }

    /// @notice Vote on a proposal. 1 wallet = 1 vote.
    /// @param proposalId target proposal
    /// @param support true = yes, false = no
    function voteOnProposal(uint256 proposalId, bool support)
        external
        proposalExists(proposalId)
    {
        Proposal storage proposal = proposals[proposalId];

        require(
            isMember[proposal.communityId][msg.sender],
            "Not a member of this community"
        );
        require(block.timestamp <= proposal.deadline, "Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            proposal.yesVotes += 1;
        } else {
            proposal.noVotes += 1;
        }

        userVotes[msg.sender].push(proposalId);

        emit Voted(proposalId, msg.sender, support);
    }

    // ============ View Functions (for frontend) ============

    /// @notice Total number of communities (for pagination).
    function getCommunitiesCount() external view returns (uint256) {
        return communities.length;
    }

    /// @notice Get all community IDs a user is a member of.
    /// @dev Use this for "My communities".
    function getUserCommunityIds(address user)
        external
        view
        returns (uint256[] memory)
    {
        return userCommunities[user];
    }

    /// @notice Get all proposal IDs in a community.
    function getCommunityProposalIds(uint256 communityId)
        external
        view
        communityExists(communityId)
        returns (uint256[] memory)
    {
        return communityProposals[communityId];
    }

    /// @notice Get all proposal IDs created by a user.
    /// @dev Use this for "My proposals".
    function getUserProposalIds(address user)
        external
        view
        returns (uint256[] memory)
    {
        return userProposals[user];
    }

    /// @notice Get all proposal IDs a user has voted on.
    /// @dev Use this for "My votes".
    function getUserVoteIds(address user)
        external
        view
        returns (uint256[] memory)
    {
        return userVotes[user];
    }

    /// @notice Helper: check if a user is member of a community.
    function isCommunityMember(uint256 communityId, address user)
        external
        view
        communityExists(communityId)
        returns (bool)
    {
        return isMember[communityId][user];
    }

    /// @notice Get basic information about a proposal.
    function getProposal(uint256 proposalId)
        external
        view
        proposalExists(proposalId)
        returns (Proposal memory)
    {
        return proposals[proposalId];
    }

    /// @notice Get basic information about a community.
    function getCommunity(uint256 communityId)
        external
        view
        communityExists(communityId)
        returns (Community memory)
    {
        return communities[communityId];
    }
}
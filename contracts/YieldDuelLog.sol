// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title YieldDuelLog
/// @notice On-chain decision log for Human vs AI RWA treasury duels on Mantle
contract YieldDuelLog {
    enum Actor { Human, Agent }
    enum Winner { Human, Agent, Tie }

    struct Decision {
        Actor actor;
        address duelist;
        uint8 usdyPct;
        uint8 methPct;
        uint8 mntPct;
        uint256 timestamp;
        bytes32 reasoningHash;
    }

    struct DuelResult {
        bytes32 duelId;
        address duelist;
        uint16 humanYieldBps;
        uint16 agentYieldBps;
        Winner winner;
        uint256 timestamp;
    }

    address public owner;
    uint256 public decisionCount;
    uint256 public duelCount;

    mapping(uint256 => Decision) public decisions;
    mapping(uint256 => DuelResult) public duels;
    mapping(bytes32 => bool) public duelExists;

    event DecisionLogged(
        uint256 indexed decisionId,
        Actor indexed actor,
        address indexed duelist,
        uint8 usdyPct,
        uint8 methPct,
        uint8 mntPct,
        bytes32 reasoningHash
    );

    event DuelCommitted(
        bytes32 indexed duelId,
        address indexed duelist,
        uint16 humanYieldBps,
        uint16 agentYieldBps,
        Winner winner
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function _logDecision(
        Actor actor,
        uint8 usdyPct,
        uint8 methPct,
        uint8 mntPct,
        bytes32 reasoningHash
    ) internal returns (uint256 decisionId) {
        decisionId = ++decisionCount;
        decisions[decisionId] = Decision({
            actor: actor,
            duelist: msg.sender,
            usdyPct: usdyPct,
            methPct: methPct,
            mntPct: mntPct,
            timestamp: block.timestamp,
            reasoningHash: reasoningHash
        });

        emit DecisionLogged(decisionId, actor, msg.sender, usdyPct, methPct, mntPct, reasoningHash);
    }

    /// @notice Log a single portfolio allocation decision
    function logDecision(
        Actor actor,
        uint8 usdyPct,
        uint8 methPct,
        uint8 mntPct,
        bytes32 reasoningHash
    ) external returns (uint256 decisionId) {
        require(usdyPct + methPct + mntPct == 100, "Allocation must sum to 100");
        return _logDecision(actor, usdyPct, methPct, mntPct, reasoningHash);
    }

    /// @notice Commit a full duel round in one transaction (human + agent + result)
    function commitDuel(
        uint8 humanUsdy,
        uint8 humanMeth,
        uint8 humanMnt,
        uint8 agentUsdy,
        uint8 agentMeth,
        uint8 agentMnt,
        uint16 humanYieldBps,
        uint16 agentYieldBps,
        bytes32 humanReasoningHash,
        bytes32 agentReasoningHash
    ) external returns (bytes32 duelId) {
        require(humanUsdy + humanMeth + humanMnt == 100, "Human allocation invalid");
        require(agentUsdy + agentMeth + agentMnt == 100, "Agent allocation invalid");

        _logDecision(Actor.Human, humanUsdy, humanMeth, humanMnt, humanReasoningHash);
        _logDecision(Actor.Agent, agentUsdy, agentMeth, agentMnt, agentReasoningHash);

        duelId = keccak256(abi.encodePacked(msg.sender, block.timestamp, humanReasoningHash, agentReasoningHash));
        require(!duelExists[duelId], "Duel already exists");

        Winner winner;
        if (humanYieldBps > agentYieldBps) {
            winner = Winner.Human;
        } else if (agentYieldBps > humanYieldBps) {
            winner = Winner.Agent;
        } else {
            winner = Winner.Tie;
        }

        duelCount++;
        duelExists[duelId] = true;
        duels[duelCount] = DuelResult({
            duelId: duelId,
            duelist: msg.sender,
            humanYieldBps: humanYieldBps,
            agentYieldBps: agentYieldBps,
            winner: winner,
            timestamp: block.timestamp
        });

        emit DuelCommitted(duelId, msg.sender, humanYieldBps, agentYieldBps, winner);
    }

    /// @notice AI-powered on-chain trigger using inference hash
    function triggerAgentInference(bytes32 inferenceHash) external returns (uint256) {
        return _logDecision(Actor.Agent, 55, 30, 15, inferenceHash);
    }
}
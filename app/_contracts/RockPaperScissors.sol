// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract RockPaperScissors {
  uint public constant BET_MIN = 1e16;
  uint public constant REVEAL_TIMEOUT = 10 minutes;

  enum Moves {
    None,
    Rock,
    Paper,
    Scissors
  }

  enum Outcomes {
    None,
    Player,
    Draw,
    Owner // New outcome for when the contract (or owner) wins
  }

  address payable public player;

  bytes32 private encrMovePlayer;

  Moves private movePlayer;

  Moves public moveOwner;

  bool private gameInProgress = false;

  uint public playerBet;

  address private owner;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  modifier notInProgress() {
    require(!gameInProgress);
    _;
  }

    modifier InProgress() {
    require(gameInProgress);
    _;
  }

  function register() public payable notInProgress returns (uint) {
    require(msg.value >= BET_MIN, 'Bet must be greater than minimum amount');
    player = payable(msg.sender);
    playerBet = msg.value;
    gameInProgress = true;
    return 1;
  }

  function play(bytes32 encrMove) public InProgress returns (bool) {
    require(msg.sender == player, 'Only the registered player can play');
    encrMovePlayer = encrMove;
    moveOwner = Moves(
      (uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 3) + 1
    );
    return true;
  }

 
  function reveal(string memory secret) public InProgress returns (bool) {
    bytes32 encrMove = sha256(abi.encodePacked(secret)); // Hash of clear input (= "move-password")
    Moves move = Moves(getFirstChar(secret)); // Actual move (Rock / Paper / Scissors)

    // If move invalid, exit
    if (move == Moves.None) {
      return false;
    }
    if (msg.sender == player && encrMove == encrMovePlayer) {
      movePlayer = move;
    } else {
      return false;
    }

    return getOutcome();
  }

  function getOutcome() private returns (bool) {
    bool outcome;
    address payable addr = player;
    if (movePlayer == moveOwner) {
      outcome = false;
      require(address(this).balance >= playerBet, 'Contract balance is insufficient');
      addr.transfer(playerBet);
    } else if (
      (movePlayer == Moves.Rock && moveOwner == Moves.Scissors) ||
      (movePlayer == Moves.Paper && moveOwner == Moves.Rock) ||
      (movePlayer == Moves.Scissors && moveOwner == Moves.Paper)
    ) {
      outcome = true;
    } else {
      outcome = false;
    }
    if (outcome == true) {
      require(address(this).balance >= playerBet * 2, 'Contract balance is insufficient');
      addr.transfer(playerBet * 2);
    }
    reset();
    return outcome;
  }

  function reset() private {
    player = payable(address(0x0));
    encrMovePlayer = 0x0;
    moveOwner = Moves.None;
    movePlayer = Moves.None;
    gameInProgress = false;
    playerBet = 0;
  }

  function fundContract() public payable onlyOwner {
    require(msg.value >= 0.1 ether, 'Minimum funding is 0.1 ether');
  }

  function getFirstChar(string memory str) private pure returns (uint) {
    bytes1 firstByte = bytes(str)[0];
    if (firstByte == 0x31) {
      return 1;
    } else if (firstByte == 0x32) {
      return 2;
    } else if (firstByte == 0x33) {
      return 3;
    } else {
      return 0;
    }
  }
}

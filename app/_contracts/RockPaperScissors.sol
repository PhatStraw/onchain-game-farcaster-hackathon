// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract RockPaperScissorsGame {

    uint constant public REVEAL_DURATION = 1 minutes;  
    uint private firstRevealTimestamp;                 

    enum Choices {None, Rock, Paper, Scissors}        
    enum Results {None, PlayerOne, PlayerTwo, Draw}

    // Players' addresses
    address playerOne;                                
    address playerTwo;                                

    // Encrypted moves
    bytes32 private encrChoicePlayerOne;              
    bytes32 private encrChoicePlayerTwo;              

    // Clear moves set only after both players have committed their encrypted moves
    Choices private choicePlayerOne;                  
    Choices private choicePlayerTwo;                  

    /**************************************************************************/
    /*************************** REGISTRATION PHASE ***************************/
    /**************************************************************************/

    modifier notYetRegistered() {                     
        require(msg.sender != playerOne && msg.sender != playerTwo);
        _;
    }

    // Register a player.
    // Return player's ID upon successful registration.
    function signUp() public notYetRegistered returns (uint) {  
        if (playerOne == address(0x0)) {
            playerOne = msg.sender;
            return 1;
        } else if (playerTwo == address(0x0)) {
            playerTwo = msg.sender;
            return 2;
        }
        return 0;
    }

    /**************************************************************************/
    /****************************** COMMIT PHASE ******************************/
    /**************************************************************************/

    modifier hasRegistered() {                        
        require (msg.sender == playerOne || msg.sender == playerTwo);
        _;
    }

    // Save player's encrypted move.
    // Return 'true' if move was valid, 'false' otherwise.
    function makeMove(bytes32 encrChoice) public hasRegistered returns (bool) { 
        if (msg.sender == playerOne && encrChoicePlayerOne == 0x0) {
            encrChoicePlayerOne = encrChoice;
        } else if (msg.sender == playerTwo && encrChoicePlayerTwo == 0x0) {
            encrChoicePlayerTwo = encrChoice;
        } else {
            return false;
        }
        return true;
    }

    /**************************************************************************/
    /****************************** REVEAL PHASE ******************************/
    /**************************************************************************/

    modifier commitPhaseFinished() {                  
        require(encrChoicePlayerOne != 0x0 && encrChoicePlayerTwo != 0x0);
        _;
    }

    // Compare clear move given by the player with saved encrypted move.
    // Return clear move upon success, 'Choices.None' otherwise.
    function disclose(string memory clearChoice) public hasRegistered commitPhaseFinished returns (Choices) {  // Previously: reveal
        bytes32 encrChoice = sha256(abi.encodePacked(clearChoice));  
        Choices choice     = Choices(getFirstChar(clearChoice));     // Actual move (Rock / Paper / Scissors)

        // If move invalid, exit
        if (choice == Choices.None) {
            return Choices.None;
        }

        // If hashes match, clear move is saved
        if (msg.sender == playerOne && encrChoice == encrChoicePlayerOne) {
            choicePlayerOne = choice;
        } else if (msg.sender == playerTwo && encrChoice == encrChoicePlayerTwo) {
            choicePlayerTwo = choice;
        } else {
            return Choices.None;
        }

        // Timer starts after first revelation from one of the player
        if (firstRevealTimestamp == 0) {
            firstRevealTimestamp = block.timestamp;
        }

        return choice;
    }

    // Return first character of a given string.
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


    /**************************************************************************/
    /****************************** RESULT PHASE ******************************/
    /**************************************************************************/

    modifier revealPhaseFinished() {                  
        require((choicePlayerOne != Choices.None && choicePlayerTwo != Choices.None) ||
                (firstRevealTimestamp != 0 && block.timestamp > firstRevealTimestamp + REVEAL_DURATION));
        _;
    }

    // Compute the outcome and return the outcome.
    function determineOutcome() public revealPhaseFinished returns (Results) {  
        Results outcome;

        if (choicePlayerOne == choicePlayerTwo) {
            outcome = Results.Draw;
        } else if ((choicePlayerOne == Choices.Rock     && choicePlayerTwo == Choices.Scissors) ||
                   (choicePlayerOne == Choices.Paper    && choicePlayerTwo == Choices.Rock)     ||
                   (choicePlayerOne == Choices.Scissors && choicePlayerTwo == Choices.Paper)    ||
                   (choicePlayerOne != Choices.None     && choicePlayerTwo == Choices.None)) {
            outcome = Results.PlayerOne;
        } else {
            outcome = Results.PlayerTwo;
        }

        restartGame();  
        return outcome;
    }

    // Reset the game.
    function restartGame() private {                   
        firstRevealTimestamp = 0;
        playerOne            = address(0x0);
        playerTwo            = address(0x0);
        encrChoicePlayerOne  = 0x0;
        encrChoicePlayerTwo  = 0x0;
        choicePlayerOne      = Choices.None;
        choicePlayerTwo      = Choices.None;
    }

    /**************************************************************************/
    /**************************** HELPER FUNCTIONS ****************************/
    /**************************************************************************/

    // Return player's ID
    function identifyPlayer() public view returns (uint) {  
        if (msg.sender == playerOne) {
            return 1;
        } else if (msg.sender == playerTwo) {
            return 2;
        } else {
            return 0;
        }
    }

    // Return 'true' if both players have commited a move, 'false' otherwise.
    function haveBothPlayed() public view returns (bool) {  
        return (encrChoicePlayerOne != 0x0 && encrChoicePlayerTwo != 0x0);
    }

    // Return 'true' if both players have revealed their move, 'false' otherwise.
    function haveBothRevealed() public view returns (bool) {  
        return (choicePlayerOne != Choices.None && choicePlayerTwo != Choices.None);
    }

    // Return time left before the end of the revelation phase.
    function timeLeftToReveal() public view returns (int) {  
        if (firstRevealTimestamp != 0) {
            return int((firstRevealTimestamp + REVEAL_DURATION) - block.timestamp);
        }
        return int(REVEAL_DURATION);
    }
}
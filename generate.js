// const crypto = require('crypto');
// const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// function generateHash(secret) {
//     const hash = crypto.createHash('sha256');
//     hash.update(secret);
//     return hash.digest('hex');
// }

// function main() {
//     console.log("***** Rock-Paper-Scissor Smart Contract *****\n");
//     console.log("1. Rock");
//     console.log("2. Paper");
//     console.log("3. Scissors");
//     console.log("0. Quit");

//     readline.question("Your move: ", move => {
//         if (move === "0") {
//             readline.close();
//             return;
//         }
//         if (!["1", "2", "3"].includes(move)) {
//             console.log("Invalid move.");
//             main();
//             return;
//         }
//         readline.question("Your password: ", password => {
//             const secret = move + "-" + password;
//             const hash_secret = "0x" + generateHash(secret);
//             console.log("\nSECRET:", secret);
//             console.log("HASH  :", hash_secret);
//             console.log("\nSend HASH to method 'play' (quotation marks included)");
//             console.log("Send SECRET to method 'reveal' (quotation marks included)");
//             readline.close();
//         });
//     });
// }

// main();

// const message = "hello this is a story";
// const bytes = Buffer.from(message, 'utf8');

// console.log(bytes.toString('hex'));


const revealAbi = {
    "constant": false,
    "inputs": [{"name": "secret", "type": "string"}],
    "name": "reveal",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"}
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');


async function decodeInputData() {
    const txHash = '0x5a23476d930ade401dc4d71aa33388cf5a741a4b9e955a29a1b34836cedf059f';
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) throw new Error("Transaction receipt not found");
    const boolValue = parseInt(receipt.logs[0]?.data || "", 16) === 1;
    // Replace the Web3 initialization with ethers
    console.log(boolValue);
   
}

decodeInputData();
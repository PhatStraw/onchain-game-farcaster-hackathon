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


// const revealAbi = {
//     "constant": false,
//     "inputs": [{"name": "secret", "type": "string"}],
//     "name": "reveal",
//     "outputs": [{"name": "", "type": "bool"}],
//     "payable": false,
//     "stateMutability": "nonpayable",
//     "type": "function"}
//     const ethers = require('ethers');

//     const { Web3 } = require('web3');

//     const web3 = new Web3('https://base-mainnet.g.alchemy.com/v2/iDFf5eN_U6n_FW4zKq2U8n0M6feutYwx');
//     console.log(web3)
//     async function decodeInputData() {
//         const txHash = '0x5a23476d930ade401dc4d71aa33388cf5a741a4b9e955a29a1b34836cedf059f';
//         const receipt = await web3.eth.getTransactionReceipt(txHash);
//         if (!receipt) throw new Error("Transaction receipt not found");
//         const boolValue = parseInt(receipt.logs[0]?.data || "", 16) === 1;
//         console.log(boolValue);
//     }
    
//     decodeInputData();


// async function sendEthToSelf() {
//     // Connect to the Ethereum network
//     const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');

  
//     // Create a wallet instance
//     const wallet = new ethers.Wallet("10b1b74fc62d5c0767d42e4be56cdf3d5fcc023b3d66c6d05e991cb526945013", provider);
  
//     // Define the transaction
//     const tx = {
//       to: "0xA6eBc4647fbDd7Ad02796D2c0c9769aABc65d246", // Sending to self
//       // Value is in wei (1 ether = 1e18 wei)
//       value: 1e15
//     };
  
//     try {
//       console.log(`Sending 0.00001 ETH to ${wallet.address}...`);
//       // Send the transaction
//       const txResponse = await wallet.sendTransaction(tx);
//       console.log('Transaction response:', txResponse);
  
//       // Wait for the transaction to be mined
//       const receipt = await txResponse.wait();
//       console.log('Transaction receipt:', receipt);
//     } catch (error) {
//       console.error('Error sending ETH:', error);
//     }
//   }
  
//   sendEthToSelf();

async function getTransactionReceipt(txHash) {
    const fetch = (await import('node-fetch')).default;
  const response = await fetch(
    'https://base-mainnet.g.alchemy.com/v2/iDFf5eN_U6n_FW4zKq2U8n0M6feutYwx',
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        id: 8453,
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.result; // Assuming you want the 'result' part of the JSON response
}

getTransactionReceipt("0x5a23476d930ade401dc4d71aa33388cf5a741a4b9e955a29a1b34836cedf059f").then((i)=>{
    console.log(i)
})
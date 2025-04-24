// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IPFSStorage {
    // Mapping to store IPFS hashes
    mapping(string => bool) private storedHashes;

    // Event to log when a hash is stored
    event HashStored(string ipfsHash, address indexed sender);

    // Store the IPFS hash on the blockchain
    function storeHash(string calldata ipfsHash) external {
        require(!storedHashes[ipfsHash], "Hash already stored");
        storedHashes[ipfsHash] = true;
        emit HashStored(ipfsHash, msg.sender);
    }

    // Check if the IPFS hash has been stored
    function isHashStored(string calldata ipfsHash) external view returns (bool) {
        return storedHashes[ipfsHash];
    }
}


// Sepolia Smart Contract Deployed Address: 0x599050B65aa8e431707030F27042859769D29742
// [
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": false,
// 				"internalType": "string",
// 				"name": "ipfsHash",
// 				"type": "string"
// 			},
// 			{
// 				"indexed": true,
// 				"internalType": "address",
// 				"name": "sender",
// 				"type": "address"
// 			}
// 		],
// 		"name": "HashStored",
// 		"type": "event"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "string",
// 				"name": "ipfsHash",
// 				"type": "string"
// 			}
// 		],
// 		"name": "storeHash",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "string",
// 				"name": "ipfsHash",
// 				"type": "string"
// 			}
// 		],
// 		"name": "isHashStored",
// 		"outputs": [
// 			{
// 				"internalType": "bool",
// 				"name": "",
// 				"type": "bool"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	}
// ]
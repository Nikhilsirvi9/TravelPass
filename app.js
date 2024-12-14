// Declare global variables
let userAccount = null;
let web3;
let contract;

// Replace with your contract's ABI and Address
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "hash",
				"type": "string"
			}
		],
		"name": "DocumentStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "hash",
				"type": "string"
			}
		],
		"name": "storeDocumentHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "documentHashes",
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
				"internalType": "string",
				"name": "hash",
				"type": "string"
			}
		],
		"name": "verifyDocumentHash",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0x425492f75Cddc5714217f008d69426153aecb809'; // Replace with your contract's address

// Function to connect to MetaMask
async function connectToWallet() {
    if (typeof window.ethereum !== "undefined") {
        // MetaMask is installed
        web3 = new Web3(window.ethereum); // Initialize Web3 with MetaMask

        try {
            // Request user to connect MetaMask
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0]; // Get the connected account
            console.log("Connected account:", userAccount);

            // Display the connected wallet address
            document.getElementById("walletAddress").innerText = `Connected Account: ${userAccount}`;

            // Initialize the contract instance
            contract = new web3.eth.Contract(contractABI, contractAddress);

            // Disable the connect button after successful connection
            document.getElementById("connectButton").disabled = true;

        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            alert("Please allow access to your MetaMask account.");
        }
    } else {
        // MetaMask is not installed
        alert("Please install MetaMask to use this app.");
    }
}

// Enable the "Generate Random Hash" button when a file is uploaded
function onFileUpload() {
    const fileInput = document.getElementById("fileInput");
    const generateHashButton = document.getElementById("generateHashButton");
    
    if (fileInput.files.length > 0) {
        // Enable the Generate Random Hash button after file upload
        generateHashButton.disabled = false;
    } else {
        // Disable the Generate Random Hash button if no file is uploaded
        generateHashButton.disabled = true;
    }
}

// Generate random hash (for example, use a random string generator)
function generateRandomHash() {
    const randomHash = "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    document.getElementById("fileHash").value = randomHash;

    // Disable the button after generating hash
    document.getElementById("generateHashButton").disabled = true;
}

// Store the generated hash to the blockchain
async function storeHash() {
    if (!userAccount) {
        alert("Please connect your wallet first.");
        return;
    }

    const hash = document.getElementById("fileHash").value;

    if (!hash) {
        alert("Please generate or input a hash first!");
        return;
    }

    try {
        // Send the hash to the contract for storage
        await contract.methods.storeDocumentHash(hash).send({ from: userAccount })
        .on('transactionHash', (txHash) => {
            document.getElementById("result").innerText = `Transaction sent: ${txHash}`;
        })
        .on('receipt', (receipt) => {
            document.getElementById("result").innerText = "Hash stored successfully!";
        })
        .on('error', (error) => {
            console.error("Error storing hash:", error);
            document.getElementById("result").innerText = "Error storing hash.";
        });
    } catch (error) {
        console.error("Error storing hash:", error);
        document.getElementById("result").innerText = "Error storing hash.";
    }
}

// Check if the hash exists in the blockchain
async function checkHash() {
    const hash = document.getElementById("fileHash").value;

    if (!hash) {
        alert("Please generate or input a hash first!");
        return;
    }

    try {
        // Call the contract method to verify the hash
        const exists = await contract.methods.verifyDocumentHash(hash).call();
        document.getElementById("result").innerText = exists
            ? "Hash exists in the blockchain!"
            : "Hash does not exist in the blockchain!";
    } catch (error) {
        console.error("Error verifying hash:", error);
        document.getElementById("result").innerText = "Error verifying hash.";
    }
}

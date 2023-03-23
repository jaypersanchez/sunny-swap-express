require('dotenv').config()
const { NftSwap, NftSwapV4 } = require('@traderxyz/nft-swap-sdk')
const Web3 = require('web3')
const ethers = require('ethers')
const { Network, Alchemy } = require('alchemy-sdk')

// From your app, provide NftSwap the web3 provider, signer for the user's wallet, and the chain id.
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER)
const wallet = new ethers.Wallet(process.env.WALLET_PK)
const signer = wallet.connect(provider)
//Taker Signer
const taker_wallet = new ethers.Wallet(process.env.TAKER_WALLET_PK)
const signerForTaker = taker_wallet.connect(provider)
//Maker
const CRYPTOPUNK_420 = {
    tokenAddress: '0xCe8771D0b27a3e9aA7FEC79A8b7fdC95927ac567', // CryptoPunk contract address
    tokenId: '2', // Token Id of the CryptoPunk we want to swap
    type: 'ERC1155', // Must be one of 'ERC20', 'ERC721', or 'ERC1155'
  };
  //Taker
  const BORED_APE_69 = {
    tokenAddress: '0xAB0199069C72D2F02c8F2AA2Eb117D918Cb9Bbaf', // BAYC contract address
    tokenId: '1', // Token Id of the BoredApe we want to swap
    type: 'ERC1155',
  };
  
  // User A Trade Data
const walletAddressUserA = process.env.WALLET;
const assetsToSwapUserA = [CRYPTOPUNK_420];

// User B Trade Data
const walletAddressUserB = process.env.TAKER_WALLET;
const assetsToSwapUserB = [BORED_APE_69];


// Initiate the SDK for User A.
// Pass the user's wallet signer (available via the user's wallet provider) to the Swap SDK
const nftSwapSdk = new NftSwapV4(provider, signer, process.env.CHAIN_ID);
//straight approve
nftSwapSdk.approveTokenOrNftByAsset( CRYPTOPUNK_420, walletAddressUserA )
.then( approvalTx => {
    approvalTx.wait()
    .then( approvalTxReceipt => {
        console.log(
            `Approved ${CRYPTOPUNK_420} contract to swap with 0x (txHash: ${approvalTxReceipt.transactionHash})`
        );
    })
    
})

// Create the order (Remember, User A initiates the trade, so User A creates the order)
const order = nftSwapSdk.buildOrder(
    CRYPTOPUNK_420,
    BORED_APE_69,
    walletAddressUserA
);
// Sign the order (User A signs since they are initiating the trade)
nftSwapSdk.signOrder(order, walletAddressUserA)
.then( signedOrder => {
    //Part 2 of the trade.  Taker accepts and fills order.  This will complete the trade.
    const nftSwapSdk = new NftSwapV4(provider, signerForTaker, process.env.CHAIN_ID);
    //straight approval
    nftSwapSdk.approveTokenOrNftByAsset( BORED_APE_69, walletAddressUserB )
    .then( approvalTx => {
        approvalTx.wait()
        .then( approvalTxReceipt => {
            console.log(
            `Approved ${BORED_APE_69.tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`
            );
        })
    })
})

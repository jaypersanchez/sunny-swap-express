require('dotenv').config()
const Web3 = require('web3')
const ethers = require('ethers')
const { Network, Alchemy } = require('alchemy-sdk')
const { ERC721Order, ERC1155Order, NFTOrder, SignatureType } = require('@0x/protocol-utils')
const utils = require("@0x/utils")
const { assetDataUtils } = require('@0x/order-utils');
const { NftSwap } = require('@traderxyz/nft-swap-sdk');

// Create network and wallet connection
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER)
const wallet = new ethers.Wallet(process.env.WALLET_PK)
//const signer = wallet.connect(provider)
const signer = new ethers.Wallet(process.env.WALLET_PK, provider);
//const takerWallet = new ethers.Wallet(process.env.TAKER_WALLET)
const signerTaker = new ethers.Wallet(process.env.TAKER_WALLET_PK, provider);


/*
* Create Order NFT <-> NFT Order
*/
const NFT_FUNGE_A = {
    tokenAddress: process.env.NFT_FUNGE_A,
    tokenId: process.env.NFT_FUNGE_A_1,
    type: 'ERC1155', // Must be one of 'ERC20', 'ERC721', or 'ERC1155'
};

const NFT_FUNGE_B = {
    tokenAddress: process.env.NFT_FUNGE_B,
    tokenId: process.env.NFT_FUNGE_B_1,
    type: 'ERC1155', // Must be one of 'ERC20', 'ERC721', or 'ERC1155'
};

// User A Trade Data
const makerWallet = process.env.WALLET;
const assetsToSwapUserA = [NFT_FUNGE_A];

// User B Trade Data
//const takerWallet = process.env.TAKER_WALLET;
const assetsToSwapUserB = [NFT_FUNGE_B];

// From your app, provide NftSwap the web3 provider, signer for the user's wallet, and the chain id.
const nftSwapSdk = new NftSwap(provider, signer, process.env.CHAIN_ID);
//perform straight approval
//approvalStatusForUserA.contractApproved = true
nftSwapSdk.approveTokenOrNftByAsset(assetsToSwapUserA[0], process.env.WALLET)
.then(approvalTx => {
    approvalTx.wait()
    .then(approvalReceipt => {
        console.log(
            `Approved ${assetsToSwapUserA[0].tokenAddress} contract to swap with 0x (txHash: ${approvalTxReceipt.transactionHash})`
          );
    })
})

// Create the order (Remember, User A initiates the trade, so User A creates the order)
const order = nftSwapSdk.buildOrder(
    assetsToSwapUserA,
    assetsToSwapUserB,
    makerWallet
  );
  // Sign the order (User A signs since they are initiating the trade)
  nftSwapSdk.signOrder(order, process.env.WALLET)
  .then(signedOrder => {
    // Taker will accept the order. Taker is the owner of the NFT that the maker has initiated the swap
    const nftSwapSdk_Taker = new NftSwap(provider, signerTaker, process.env.CHAIN_ID)
    //straight approval
    nftSwapSdk.approveTokenOrNftByAsset(assetsToSwapUserB[0], process.env.TAKER_WALLET)
    .then(approvalTx => {
        approvalTx.wait()
        .then(approvalTxReceipt => {
            console.log(
                `Approved ${assetsToSwapUserB[0].tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`
            );
        })
    })
    // The final step is the taker (User B) submitting the order.
    // The taker approves the trade transaction and it will be submitted on the blockchain for settlement.
    // Once the transaction is confirmed, the trade will be settled and cannot be reversed.
    nftSwapSdk.fillSignedOrder(signedOrder)
    .then(fillTx => {
        nftSwapSdk.awaitTransactionHash(fillTx)
        .then(fillTxReceipt => {
            console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`);
        })
    })
  })
  .catch(error => {
    console.log(`error signing order`)
  })














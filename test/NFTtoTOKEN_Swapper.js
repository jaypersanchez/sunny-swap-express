require('dotenv').config()
const { NftSwap, NftSwapV4 } = require('@traderxyz/nft-swap-sdk')
const Web3 = require('web3')
const ethers = require('ethers')
const { Network, Alchemy } = require('alchemy-sdk')

// From your app, provide NftSwap the web3 provider, signer for the user's wallet, and the chain id.
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER)
//NFT Owner
const wallet = new ethers.Wallet(process.env.WALLET_PK)
const signer = wallet.connect(provider)
//Taker/Bidder Signer
const taker_wallet = new ethers.Wallet(process.env.TAKER_WALLET_PK)
const signerForTaker = taker_wallet.connect(provider)

const NFTFunge_2 = {
    tokenAddress: '0x3f64cd9ec941230097f7d3757d99c64b9f8e3864',
    tokenId: '1', // Token Id of the CryptoPunk we want to swap
    type: 'ERC1155', // Must be one of 'ERC20', 'ERC721', or 'ERC1155'
    gas: 21000,
    gasPrice: 8000000000,
    gasLimit: 5000000
  };
  //Bidder
  const ONE_DOLLAR_SEVENTY_FOUR_WETH = {
    tokenAddress: '0x0000000000000000000000000000000000001010', // MATIC
    amount: Web3.utils.toWei('0.0001'), // $1.74 Wrapped-ETH (WETH is 18 digits)
    type: 'ERC20',
    gas: 21000,
    gasPrice: 8000000000,
    gasLimit: 5000000
  };
  
  // User A Trade Data
const walletAddressUserA = process.env.WALLET;
const assetsToSwapUserA = [NFTFunge_2];

// User B Trade Data
const walletAddressUserB = process.env.TAKER_WALLET;
const assetsToSwapUserB = [ONE_DOLLAR_SEVENTY_FOUR_WETH];

// Initiate the SDK for User A.
// Pass the user's wallet signer (available via the user's wallet provider) to the Swap SDK
const nftSwapSdk = new NftSwapV4(provider, signer, process.env.CHAIN_ID);
//straight approve
/*nftSwapSdk.approveTokenOrNftByAsset( NFTFunge_2, walletAddressUserA )
.then( approvalTx => {
    approvalTx.wait()
    .then( approvalTxReceipt => {
        console.log(
            `Approved ${NFTFunge_2.tokenAddress} contract to swap with 0x (txHash: ${approvalTxReceipt.transactionHash})`
        );
    })
    
})*/

// Create the order (Remember, User A initiates the trade, so User A creates the order)
const order = nftSwapSdk.buildOrder(
    NFTFunge_2,
    ONE_DOLLAR_SEVENTY_FOUR_WETH,
    walletAddressUserA
);
// Sign the order (User A signs since they are initiating the trade)
nftSwapSdk.signOrder(order, walletAddressUserA)
.then( signedOrder => {
    //Part 2 of the trade.  Taker accepts and fills order.  This will complete the trade.
    const nftSwapSdk = new NftSwapV4(provider, signerForTaker, process.env.CHAIN_ID);
    //straight approval
    /*nftSwapSdk.approveTokenOrNftByAsset( ONE_DOLLAR_SEVENTY_FOUR_WETH, walletAddressUserB )
    .then( approvalTx => {
        approvalTx.wait()
        .then( approvalTxReceipt => {
            console.log(
            `Approved ${ONE_DOLLAR_SEVENTY_FOUR_WETH.tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`
            );
        })
    })*/

    //now that it's been approved, fill the order
    nftSwapSdk.fillSignedOrder(signedOrder, {amount:Web3.utils.toWei('0.0001'),   gas: 21000,
    gasPrice: 8000000000,gasLimit: 5000000})
    .then( fillTx => {
        nftSwapSdk.awaitTransactionHash(fillTx.hash)
        .then(fillTxReceipt => {
            console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`);
        })
    })
        
})

require('dotenv').config()
const { NftSwapV4 } = require('@traderxyz/nft-swap-sdk')
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

// Set up the assets we want to swap (CryptoPunk #69 and 420 WETH)
const CRYPTOPUNK = {
    tokenAddress: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
    tokenId: '69',
    type: 'ERC721', // 'ERC721' or 'ERC1155'
  };
  const FOUR_HUNDRED_TWENTY_WETH = {
    tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f', // WETH contract address
    amount: '420000000000000000000', // 420 Wrapped-ETH (WETH is 18 digits)
    type: 'ERC20',
  };


const nftSwapSdk = new NftSwapV4(provider, signer, process.env.CHAIN_ID);
const walletAddressMaker = process.env.WALLET

// Approve NFT to trade (if required)
nftSwapSdk.approveTokenOrNftByAsset(CRYPTOPUNK, walletAddressMaker)
.then(response =>  console.log(`Maker ${JSON.stringify(response)}`) )

// Build order
const order = nftSwapSdk.buildOrder(
    CRYPTOPUNK, // Maker asset to swap
    FOUR_HUNDRED_TWENTY_WETH, // Taker asset to swap
    walletAddressMaker
);

// Sign order so order is now fillable
let signedOrder 
nftSwapSdk.signOrder(order)
.then((_signedOrder) => {
    signedOrder = _signedOrder
})

// [Part 2: Taker that wants to buy the punk fills trade]
const nftSwapSdkPart2 = new NftSwapV4(provider, signerForTaker, process.env.CHAIN_ID);
const walletAddressTaker = process.env.TAKER_WALLET
// Approve USDC to trade (if required)
nftSwapSdkPart2.approveTokenOrNftByAsset(FOUR_HUNDRED_TWENTY_WETH, walletAddressTaker)
.then((response) => {
    console.log(`Taker ${JSON.stringify(response)}`)
})

// Fill order :)
nftSwapSdkPart2.fillSignedOrder(signedOrder)
.then((fillTx) => {
    console.log(`fillTx ${JSON.stringify(fillTx)}`)
    nftSwapSdkPart2.awaitTransactionHash(fillTx.hash)
    .then((fillTxReceipt) => {
        console.log(`fillTxReceipt ${fillTxReceipt}`)
        console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`)
    })
})

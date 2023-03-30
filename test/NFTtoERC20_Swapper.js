require('dotenv').config()
const { NftSwap, NftSwapV4 } = require('@traderxyz/nft-swap-sdk')

// Scenario: User A wants to sell their CryptoPunk for 420 WETH

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

// [Part 1: Maker (owner of the Punk) creates trade]
var nftSwapSdk = new NftSwapV4(provider, signerForMaker, process.env.CHAIN_ID);
const walletAddressMaker = '0x1234...';

// Approve NFT to trade (if required)
nftSwapSdk.approveTokenOrNftByAsset(CRYPTOPUNK, walletAddressMaker);

// Build order
const order = nftSwapSdk.buildOrder(
  CRYPTOPUNK, // Maker asset to swap
  FOUR_HUNDRED_TWENTY_WETH, // Taker asset to swap
  walletAddressMaker
);
// Sign order so order is now fillable
const signedOrder = nftSwapSdk.signOrder(order);

// [Part 2: Taker that wants to buy the punk fills trade]
const nftSwapSdk = new NftSwap(provider, signerForTaker, CHAIN_ID);
const walletAddressTaker = '0x9876...';

// Approve USDC to trade (if required)
await nftSwapSdk.approveTokenOrNftByAsset(FOUR_HUNDRED_TWENTY_WETH, walletAddressTaker);

// Fill order :)
const fillTx = nftSwapSdk.fillSignedOrder(signedOrder);
const fillTxReceipt = nftSwapSdk.awaitTransactionHash(fillTx.hash);
console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`)
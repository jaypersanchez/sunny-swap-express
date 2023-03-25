require('dotenv').config()
var express = require('express');
var router = express.Router();
const { NftSwap, NftSwapV4 } = require('@traderxyz/nft-swap-sdk')
const Web3 = require('web3')
const ethers = require('ethers')

//Default transaction setup
var gas =  21000
var gasPrice = 8000000000
var gasLimit = 5000000

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('SWAP');
});

router.post('/nft', function(req, res, next) {
    // From your app, provide NftSwap the web3 provider, signer for the user's wallet, and the chain id.
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER)
    //NFT Owner
    const wallet = new ethers.Wallet(process.env.WALLET_PK)
    const signer = wallet.connect(provider)
    //Taker/Bidder Signer
    const taker_wallet = new ethers.Wallet(process.env.TAKER_WALLET_PK)
    const signerForTaker = taker_wallet.connect(provider)
    
    //setup taker bid
    console.log(`Token being bid on ${req.body.nfttotoken.maker.tokenAddress}::${req.body.nfttotoken.maker.tokenId}`)
    //assuming amount has been converted from eth to wei
    console.log(`Bidder offer ${req.body.nfttotoken.taker.tokenAddress}::${req.body.nfttotoken.taker.amount}`)
    //bidder information

    res.send(req.body)
})

module.exports = router;

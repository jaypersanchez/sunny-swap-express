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

/* This is the swapping direction.  The NFT asset to be swap for a token: USDC, MATIC, ETH
*/
var nftAsset_to_swap = {}
var tokenAsset_to_swap = {}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('SWAP');
});

router.post('/nft', function(req, res, next) {
    
    //setup taker bid
    nftAsset_to_swap = {
      tokenAddress: req.body.nfttotoken.maker.tokenAddress,
      tokenId: req.body.nfttotoken.maker.tokenId,
      type: 'ERC1155', // Must be one of 'ERC20', 'ERC721', or 'ERC1155'
      nftOwnerAddress: req.body.nfttotoken.maker.makerAddress
    }

    let _amount = Web3.utils.toWe (req.body.nfttotoken.taker.amount)
    //tokenAddress is the address of the token: USDC, DAI, ETH, WETH or MATIC
    tokenAsset_to_swap = {
      tokenAddress: req.body.nfttotoken.taker.tokenAddress, 
      amount: _amount,
      type: 'ERC20',
      takerAddress: req.body.nfttotoken.taker.takerAddress
    }

    // From your app, provide NftSwap the web3 provider, signer for the user's wallet, and the chain id.
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER)
    //NFT Owner
    const wallet = new ethers.Wallet(process.env.WALLET_PK)
    const signer = wallet.connect(provider)
    //Taker/Bidder Signer
    const taker_wallet = new ethers.Wallet(process.env.TAKER_WALLET_PK)
    const signerForTaker = taker_wallet.connect(provider)

    //Swap SDK
    /*const nftSwapSdk = new NftSwapV4(provider, signer, process.env.CHAIN_ID);
    //straight approve
    nftSwapSdk.approveTokenOrNftByAsset( nftAsset_to_swap, walletAddressUserA )
    .then( approvalTx => {
        approvalTx.wait()
        .then( approvalTxReceipt => {
            console.log(
                `Approved ${tokenAsset_to_swap.tokenAddress} contract to swap with 0x (txHash: ${approvalTxReceipt.transactionHash})`
            );
        })
        
    })*/

    res.send(req.body)
})

module.exports = router;

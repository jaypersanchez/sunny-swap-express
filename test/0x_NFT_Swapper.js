require('dotenv').config()
const Web3 = require('web3')
const ethers = require('ethers')
const { Network, Alchemy } = require('alchemy-sdk')
const { ERC721Order, ERC1155Order, NFTOrder, SignatureType } = require('@0x/protocol-utils')
const utils = require("@0x/utils")

// Create network and wallet connection
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER)
const wallet = new ethers.Wallet(process.env.WALLET_PK)
const signer = wallet.connect(provider)

/*
* Create Order NFT <-> NFT
*/
const erc1155Order = new ERC1155Order ({
    chainID: process.env.CHAIN_ID,
    // Whether to sell or buy the given NFT
    direction: NFTOrder.TradeDirection.SellNFT,
    // Address of the seller. This is also the address that will be 
    // signing this order.
    maker: process.env.WALLET,
    // A null taker address allows anyone to fill this order
    taker: '0x0000000000000000000000000000000000000000',
    // Order expires in one hour
    expiry: new utils.BigNumber(Math.floor(Date.now() / 1000 + 3600)),
    // A unique order nonce must be random
    nonce: 420,
    // This indicates that the seller would like to receive ETH.
    erc20Token: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    //Fee[] fees,
    // Address of the ERC721 contract. 
    erc721Token: process.env.NFT_FUNGE_A,
    // Token ID of the NFT to sell. 
    erc721TokenId: process.env.NFT_FUNGE_A_1,
    // The price, in this case 1 ETH. change to 0.001 -> Wei
    erc20TokenAmount: utils.BigNumber('1e18')
})

//sign order by the maker
console.log(process.env.WALLET_PK)
erc1155Order.getSignatureWithKey(process.env.WALLET_PK,SignatureType.PreSigned)
.then(signature => {
    console.log(signature)
    /*nftSwapSdk.fillSignedOrder(signedOrder, {amount:Web3.utils.toWei('0.0001'),   gas: 21000,
    gasPrice: 8000000000,gasLimit: 5000000})
    .then( fillTx => {
        nftSwapSdk.awaitTransactionHash(fillTx.hash)
        .then(fillTxReceipt => {
            console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`);
        })
    })*/

})





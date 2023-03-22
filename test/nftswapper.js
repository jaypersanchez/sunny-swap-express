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

// ............................
// Part 1 of the trade -- User A (the 'maker') initiates an order
// ............................

// Initiate the SDK for User A.
// Pass the user's wallet signer (available via the user's wallet provider) to the Swap SDK
const nftSwapSdk = new NftSwapV4(provider, signer, process.env.CHAIN_ID);
//straight approve
//console.log(`${assetsToSwapUserA[0].tokenAddress}::${walletAddressUserA}`)
nftSwapSdk.approveTokenOrNftByAsset( CRYPTOPUNK_420, walletAddressUserA )
.then( approvalTx => {
    approvalTx.wait()
    .then( approvalTxReceipt => {
        console.log(
            `Approved ${CRYPTOPUNK_420} contract to swap with 0x (txHash: ${approvalTxReceipt.transactionHash})`
        );
    })
    
})
// Check if we need to approve the NFT for swapping
//nftSwapSdk.loadApprovalStatus(
//  assetsToSwapUserA[0],
//  walletAddressUserA
//)
//.then( approvalStatusForUserA => {
    //console.log(`approvalStatusForUserA ${approvalStatusForUserA.contractApproved}`)
    //straight approve
    /*nftSwapSdk.approveTokenOrNftByAsset( assetsToSwapUserA[0], walletAddressUserA )
    .then( approvalTx => {
        approvalTx.wait()
        .then( approvalTxReceipt => {
            console.log(
                `Approved ${assetsToSwapUserA[0].tokenAddress} contract to swap with 0x (txHash: ${approvalTxReceipt.transactionHash})`
            );
        })
        
    })*/
        // If we do need to approve User A's CryptoPunk for swapping, let's do that now
    /*if (!approvalStatusForUserA.contractApproved) {
        nftSwapSdk.approveTokenOrNftByAsset(
        assetsToSwapUserA[0],
        walletAddressUserA
        )
        .then( approvalTx => {
            approvalTx.wait()
            .then( approvalTxReceipt => {
                console.log(
                    `Approved ${assetsToSwapUserA[0].tokenAddress} contract to swap with 0x (txHash: ${approvalTxReceipt.transactionHash})`
                );
            })
            
        })
    }*/
    //console.log(`approvalStatusForUserA ${approvalStatusForUserA.contractApproved}`)
//} )


// Create the order (Remember, User A initiates the trade, so User A creates the order)
/*
nftSwapSdk.buildNftAndErc20Order()
const order = nftSwapSdk.buildNftAndErc20Order(
  assetsToSwapUserA[0],
  assetsToSwapUserB[0],
  'sell',
  walletAddressUserA
);
// Sign the order (User A signs since they are initiating the trade)
nftSwapSdk.signOrder(order, walletAddressUserA)
.then( signedOrder => {
    //takerFulfillment(signedOrder)
    const nftSwapSdk = new NftSwapV4(provider, signerForTaker, process.env.CHAIN_ID);

    // Check if we need to approve the NFT for swapping
    nftSwapSdk.loadApprovalStatus(
    assetsToSwapUserB[0],
    walletAddressUserB
    )
    .then( approvalStatusForUserB => {
            console.log(`Approval Status for TAKER ${approvalStatusForUserB.contractApproved}`)
            // If we do need to approve NFT for swapping, let's do that now
            if (!approvalStatusForUserB.contractApproved) {
                
                nftSwapSdk.approveTokenOrNftByAsset(
                assetsToSwapUserB[0],
                walletAddressUserB
                )
                .then( approvalTx => {
                    approvalTx.wait()
                    .then( approvalTxReceipt => {
                        console.log(
                            `Approved ${assetsToSwapUserB[0].tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`
                        );
                    })
                })
            }
    })
    
    nftSwapSdk.fillSignedOrder(signedOrder)
    .then( fillTx => {
        nftSwapSdk.awaitTransactionHash(fillTx.hash)
        .then( fillTxReceipt => {
            console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`);
        })
    })
})
*/
// Part 1 Complete. User A is now done. Now we send the `signedOrder` to User B to complete the trade.


// ............................
// Part 2 of the trade -- User B (the 'taker') accepts and fills order from User A and completes trade
// ............................
// Initiate the SDK for User B.
/*
const takerFulfillment = async(signedOrder) => {
        // Initiate the SDK for User B.
        const nftSwapSdk = new NftSwapV4(provider, signerForTaker, process.env.CHAIN_ID);

        // Check if we need to approve the NFT for swapping
        nftSwapSdk.loadApprovalStatus(
        assetsToSwapUserB[0],
        walletAddressUserB
        )
        .then( approvalStatusForUserB => {
                console.log(`Approval Status for TAKER ${approvalStatusForUserB.contractApproved}`)
                // If we do need to approve NFT for swapping, let's do that now
                if (!approvalStatusForUserB.contractApproved) {
                    
                    nftSwapSdk.approveTokenOrNftByAsset(
                    assetsToSwapUserB[0],
                    walletAddressUserB
                    )
                    .then( approvalTx => {
                        approvalTx.wait()
                        .then( approvalTxReceipt => {
                            console.log(
                                `Approved ${assetsToSwapUserB[0].tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`
                            );
                        })
                    })
                }
        })
        const fillTx = await nftSwapSdk.fillSignedOrder(signedOrder);
        const fillTxReceipt = await nftSwapSdk.awaitTransactionHash(fillTx.hash);
        console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`);
}
*/
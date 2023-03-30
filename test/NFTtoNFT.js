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
//Maker
const makerWallet = new ethers.Wallet(process.env.WALLET_PK)
const makerSigner = wallet.connect(provider)
//Taker
const takerWallet = new ethers.Wallet(process.env.TAKER_WALLET)
const signerTaker = new ethers.Wallet(process.env.TAKER_WALLET_PK, provider);




const Web3 = require('web3');
const minimist = require('minimist');
const Bridge = require('../build/contracts/Bridge.json');
const IERC20 = require('../build/contracts/IERC20.json');
require('dotenv').config();

const args = minimist(process.argv.slice(2));
const isTest = args['mode'] != 'mainnet';

const web3Eth = new Web3(isTest ? process.env.eth_host_test : process.env.eth_host_main);
const web3Bsc = new Web3(isTest ? process.env.bsc_host_test : process.env.bsc_host_main);
const adminPrivKey = `0x${process.env.pool_key}`;
const { address: admin } = web3Eth.eth.accounts.wallet.add(adminPrivKey);
web3Bsc.eth.accounts.wallet.add(adminPrivKey);

const RockyAddressEth = "0x5bfd5dd70fcd460a08492a2333182c07251aa641";
const RockyAddressBsc = "0x75cc6feb91f9cf00b41f8d2f6f66b4aedaf9727b";
// const RockyAbi = [
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "account",
//         "type": "address"
//       }
//     ],
//     "name": "excludeFromFee",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   }
// ];

async function initBridge() {
  const ethChainId = isTest ? "3" : "1";
  const bscChainId = isTest ? "97" : "56";

  try {
    {
      // eth bridge
      const bridgeAddress = Bridge.networks[ethChainId].address;
      const rockyContract = new web3Eth.eth.Contract(IERC20.abi, RockyAddressEth);
      const balance = await rockyContract.methods.balanceOf(admin).call();
      const tx = rockyContract.methods.approve(bridgeAddress, balance);
      const gasCost = await tx.estimateGas({from: admin});
      const gasPrice = await web3Bsc.eth.getGasPrice();
      // await tx.send({from: admin, gas: gasCost, gasPrice});
      console.log("ETH Done - ", bridgeAddress, "approved", balance, gasCost, gasPrice);
    }

    {
      // bsc bridge
      const bridgeAddress = Bridge.networks[bscChainId].address;
      const rockyContract = new web3Bsc.eth.Contract(IERC20.abi, RockyAddressBsc);
      const balance = await rockyContract.methods.balanceOf(admin).call();
      const tx = rockyContract.methods.approve(bridgeAddress, balance);
      const gasCost = await tx.estimateGas({from: admin});
      const gasPrice = await web3Bsc.eth.getGasPrice();
      // await tx.send({from: admin, gas: gasCost, gasPrice});
      console.log("BSC Done - ", bridgeAddress, "approved", balance, gasCost, gasPrice);
    }

    process.exit(0);
  }
  catch(e) {
    console.log(e);
    process.exit(1);
  }
}

initBridge();

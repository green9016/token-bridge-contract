const Web3 = require('web3');
const minimist = require('minimist');
const Bridge = require('../build/contracts/Bridge.json');
require('dotenv').config();

const args = minimist(process.argv.slice(2));
const isTest = args['mode'] === 'prod';

const web3Eth = new Web3(isTest ? process.env.eth_host_test : process.env.eth_host_main);
const web3Bsc = new Web3(isTest ? process.env.bsc_host_test : process.env.bsc_host_main);
const adminPrivKey = `0x${process.env.priv_key}`;
const { address: admin } = web3Eth.eth.accounts.wallet.add(adminPrivKey);
web3Bsc.eth.accounts.wallet.add(adminPrivKey);

async function withdraw() {
  const ethChainId = isTest ? "3" : "1";
  const bscChainId = isTest ? "97" : "56";
  try {
    {
      // eth bridge
      const bridgeAddress = Bridge.networks[ethChainId].address;
      const bridgeContract = new web3Eth.eth.Contract(Bridge.abi, bridgeAddress);

      const preBalance = await web3Eth.eth.getBalance(admin);
      const tx = bridgeContract.methods.withdraw();
      const gasCost = await tx.estimateGas({from: admin});
      const gasPrice = await web3Eth.eth.getGasPrice();
      await tx.send({from: admin, gas: gasCost, gasPrice});
      const curBalance = await web3Eth.eth.getBalance(admin);
      console.log("ETH Withdrawn ", preBalance, "->", curBalance);
    }

    {
      // bsc bridge
      const bridgeAddress = Bridge.networks[bscChainId].address;
      const bridgeContract = new web3Bsc.eth.Contract(Bridge.abi, bridgeAddress);

      const preBalance = await web3Bsc.eth.getBalance(admin);
      const tx = bridgeContract.methods.withdraw();
      const gasCost = await tx.estimateGas({from: admin});
      const gasPrice = await web3Bsc.eth.getGasPrice();
      await tx.send({from: admin, gas: gasCost, gasPrice});
      const curBalance = await web3Bsc.eth.getBalance(admin);
      console.log("BSC Withdrawn ", preBalance, "->", curBalance);
    }

    process.exit(0);
  }
  catch(e) {
    console.log(e);
    process.exit(1);
  }
}

withdraw();

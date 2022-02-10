const Bridge = artifacts.require('Bridge.sol');
const RockyAddress = process.env.rocky_address;

module.exports = async function (deployer, network, addresses) {
  console.log("------", RockyAddress);
  if(network === 'ethTestnet' || network === 'ethMainnet') {
    // bridge
    const fee = web3.utils.toWei('0.00025', 'ether');
    await deployer.deploy(Bridge, fee, RockyAddress);
  }
  else if(network === 'bscTestnet' || network === 'bscMainnet') {
    // bridge
    const fee = web3.utils.toWei('0.0019', 'ether');
    await deployer.deploy(Bridge, fee, RockyAddress);
  }
};

const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
require('dotenv').config();
const { priv_key, eth_host_test, bsc_host_test, eth_host_main, bsc_host_main } = process.env;
const privateKeys = [priv_key];
module.exports = {
  networks: {
    ethMainnet: {
      provider: () => new HDWalletProvider(
        privateKeys, 
        eth_host_main,
      ),
      network_id: 1, //eth mainnet
      skipDryRun: true,
    },
    bscMainnet: {
      provider: () => new HDWalletProvider(
        privateKeys, 
        bsc_host_main
      ),
      network_id: 56, // bsc mainnet
      skipDryRun: true,
      confirmations: 10,
      timeoutBlocks: 200,
    },
    ethTestnet: {
      provider: () => new HDWalletProvider(
        privateKeys, 
        eth_host_test,
      ),
      network_id: 3, //ropsten
      skipDryRun: true,
    },
    bscTestnet: {
      provider: () => new HDWalletProvider(
        privateKeys, 
        bsc_host_test
      ),
      network_id: 97, // bsc testnet
      skipDryRun: true,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      version: "pragma",
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: 'DE2RFURK3FQCGYQNB85MCI5MKCCCFV73P2',
    bscscan: '5UXD82FJVJVS4U9ERQ64DHXIZRVE35FT7Q'
  }
};

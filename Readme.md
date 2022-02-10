## compile

truffle compile

## prepare
- set you wallet private key and network rpc url. refer .env.example
- config your correct network provider for ethTestnet and bscTestnet

## deploy
truffle migrate --reset --network ethTestnet
truffle migrate --reset --network bscTestnet

## init bridge
node scripts/init-bridge.js

## withdraw balance from bridge contract to owner.
node scripts/withdraw.js
var Web3 = require('web3')
const config = require('./config')

const { eth: { protocol, host, port } } = config
const nodeUrl = `${protocol}://${host}:${port}`

var web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl))
// if (typeof web3 !== 'undefined') {
//     web3 = new Web3(web3.currentProvider);
// } else {
//     // set the provider you want from Web3.providers
//     web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
// }

module.exports = web3

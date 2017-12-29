const config = require('../../config')
const Tx = require('ethereumjs-tx')

module.exports = function (web3) {
  var module = {}

  module.get = function (txhash) {
    var result = {}
    result.tx = web3.eth.getTransaction(txhash)
    return result
  }

  module.send = async function (from, fromKey, to, wei, gasPrice) {
    var promise = new Promise((resolve, reject) => {
      var result = {}

      var privateKey = new Buffer(fromKey, 'hex')

      // prepare the Tx parameters
      var rawTx = {
        from: from,
        to: to,
        value: wei,
        gasPrice: (gasPrice || 1),
        gasLimit: 21000, // default gas limit to send ether
        chainId: config.eth.chain_id
      }
      // create and sign the Tx
      var tx = new Tx(rawTx)
      tx.sign(privateKey)
      // see the fees required for the Tx
      // var feeCost = tx.getUpfrontCost()
      // tx.gas = feeCost
      // tx.gas = tx.gasLimit

      var serializedTx = tx.serialize()

      web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
        if (err) {
          return reject(err)
        } else {
          result.tx_hash = txHash
          return resolve(result)
        }
      })
    })

    return promise
  }

  return module
}

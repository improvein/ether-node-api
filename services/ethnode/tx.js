const config = require('../../config')
const Tx = require('ethereumjs-tx')

module.exports = function (web3) {
  var module = {}

  module.get = function (txhash) {
    var result = {}
    result.tx = web3.eth.getTransaction(txhash)
    return result
  }

  /**
   * Send ether (wei) from an account to another
   * @param {string} from Address of the sender
   * @param {string} fromKey Private key of the caller of the transaction, corresponding to the from
   * @param {string} to Address of the recipient
   * @param {string} wei Ether to be sent, in wei
   * @param {string} gasPrice Gas price for the Tx
   */
  module.send = async function (from, fromKey, to, wei, gasPrice, gasLimit) {
    var promise = new Promise((resolve, reject) => {
      var result = {}

      var privateKey = Buffer.from(fromKey, 'hex')

      // get the current gas price, either from config or from the node
      if (typeof gasPrice === 'undefined' || gasPrice == null) {
        gasPrice = config.eth.gas_price
      }
      if (gasPrice === 'auto') {
        gasPrice = web3.eth.gasPrice
        gasPrice = gasPrice.toString(10)
      }    

      // get the gas limit from the config (if exists). Otherwise leave "auto"
      if (typeof gasLimit === 'undefined' || gasLimit == null) {
        gasLimit = config.eth.gas_limit
      }
      if (gasLimit !== 'auto') {
        // gasLimit = new BigNumber(config.eth.gas_limit);
        gasLimit = web3.toHex(config.eth.gas_limit)
      }

      // calculate nonce
      var nonce = web3.eth.getTransactionCount(from)

      // prepare the Tx parameters
      var rawTx = {
        nonce: nonce,
        from: from,
        to: to,
        value: web3.toHex(wei), // .toString(10),
        gasPrice: web3.toHex(gasPrice),
        gasLimit: gasLimit,
        chainId: config.eth.chain_id
      }
      
      // create and sign the Tx
      var tx = new Tx(rawTx)
      // see the fees required for the Tx
      if (gasLimit === 'auto') {
        console.log('Auto calculating gas limit...')
        gasLimit = web3.eth.estimateGas(rawTx)
        console.log('Estimated gas: ' + gasLimit)
        tx.gasLimit = web3.toHex(gasLimit)
      }
      tx.sign(privateKey)

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

  module.sendRaw = async function (serializedTx) {
    var promise = new Promise((resolve, reject) => {
      var result = {}

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

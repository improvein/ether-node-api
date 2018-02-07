const config = require('../../config')
const Tx = require('ethereumjs-tx')

module.exports = function (web3) {
  var module = {}

  /**
   * Returns the ABI of a given Contract name
   * @param {string} contractName Name of the Contract to look up in configuration files
   */
  module.getContractAbi = function (contractName) {
    var contractAbi
    try {
      var abiPath = config.contract[contractName].abi_file
      abiPath = '../../' + abiPath
      contractAbi = require(abiPath)
    } catch (err) {
      console.log('Contact ABI load error.')
      console.log(err)
      throw err
    }
    return contractAbi
  }

  /**
   * Call a Contract method
   * @param {string} contractName Name of the Contract
   * @param {stirng} contractAddress Address of the Contract
   * @param {string} method Method to call
   * @param {array} args Arguments of the method to be called
   */
  module.call = async function (contractName, contractAddress, method, args) {
    var promise = new Promise((resolve, reject) => {
      var result = {}

      var contractAbi = module.getContractAbi(contractName)

      try {
        var Contract = web3.eth.contract(contractAbi)
        // initiate contract for an address
        var contractInstance = Contract.at(contractAddress)

        result = contractInstance[method].apply(this, Object.values(args))

        return resolve({ value: result })
      } catch (err) {
        console.log('Contract call error.')
        console.log(err)
        return reject(err)
      }
    })

    return promise
  }

  /**
   * Transact with a Contract (broadcasted and impacted in the blockchain)
   * @param {string} contractName Name of the Contract
   * @param {string} contractAddress Address of the Contract
   * @param {string} method Method to call for the transaction
   * @param {string} callerAddress Address of the caller of the transaction
   * @param {string} privateKey Private key of the caller of the transaction, corresponding to the callerAddress
   * @param {array} args Arguments of the method to be called
   */
  module.transact = async function (contractName, contractAddress, method, callerAddress, privateKey, args) {
    var promise = new Promise((resolve, reject) => {
      var result = {}

      try {
        var contractAbi = module.getContractAbi(contractName)

        var Contract = web3.eth.contract(contractAbi)
        // initiate contract for an address
        var contractInstance = Contract.at(contractAddress)
        // get the reference to the contract method, with the corresponding parameters
        var methodRef = contractInstance[method].getData.apply(this, Object.values(args))

        var privateKeyBuff = Buffer.from(privateKey, 'hex')

        // get the current gas price, either from config or from the node
        var gasPrice = config.eth.gas_price
        if (gasPrice === 'auto') {
          gasPrice = web3.eth.gasPrice
        }

        // get the gas limit from the config (if exists). Otherwise leave "auto"
        var gasLimit = 'auto'
        if (config.eth.gas_limit !== 'auto') {
          // gasLimit = new BigNumber(config.eth.gas_limit);
          gasLimit = web3.toHex(config.eth.gas_limit)
        }

        // prepare the Tx parameters
        var rawTx = {
          nonce: web3.toHex(web3.eth.getTransactionCount(web3.eth.coinbase)),
          from: callerAddress,
          to: contractAddress,
          gasPrice: gasPrice.toString(10),
          gasLimit: gasLimit, // default gas limit to send ether
          chainId: config.eth.chain_id,
          data: methodRef
        }
        // create the Tx
        var tx = new Tx(rawTx)
        // see the fees required for the Tx
        if (gasLimit === 'auto') {
          console.log('Auto calculating gas limit...')
          gasLimit = web3.eth.estimateGas(rawTx)
          console.log('Estimated gas: ' + gasLimit)
          tx.gasLimit = gasLimit
        }
        // sign the transaction
        tx.sign(privateKeyBuff)

        var serializedTx = tx.serialize()
      } catch (err) {
        console.log('Error preparing the Contract transact Tx.')
        console.log(err)
        return reject(err)
      }

      try {
        // no send the signed serialized transaction to the node
        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
          if (err) {
            return reject(err)
          } else {
            result.tx_hash = txHash
            return resolve(result)
          }
        })
      } catch (err) {
        console.log('Contract transact error.')
        console.log(err)
        return reject(err)
      }
    })

    return promise
  }

  return module
}

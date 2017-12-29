module.exports = function (web3) {
  var module = {}

  module.getStatus = function () {
    var result = {}

    result.connected = web3.isConnected()

    if (web3.isConnected()) {
      // coinbase info
      result.coinbase = web3.eth.coinbase
      result.coinbase_balance = web3.eth.getBalance(result.coinbase).toNumber()
    }

    return result
  }

  return module
}

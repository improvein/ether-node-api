module.exports = function (web3) {
  var module = {}

  module.getBalance = function (address) {
    var promise = new Promise((resolve, reject) => {
      var result = {}
      try {
        result.address = address
        result.balance = web3.eth.getBalance(address).toNumber()

        return resolve(result)
      } catch (err) {
        console.log('Error getting address balance.')
        console.log(err)
        return reject(err.message)
      }
    })

    return promise
  }

  return module
}

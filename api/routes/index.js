const nodeRoutes = require('./node_routes')

module.exports = function (app, web3) {
  // Ether node routes
  nodeRoutes(app, web3)
}

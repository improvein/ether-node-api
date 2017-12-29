const program = require('commander')
const config = require('./config')
const web3 = require('./ethconn')
const generalSrv = require('./services/ethnode/general')(web3)
const addressSrv = require('./services/ethnode/address')(web3)
const txSrv = require('./services/ethnode/tx')(web3)

program
  .version('0.0.1')
  .description('Ethereum Node API console')

program
  .command('status')
  .description('See the status of the App and the network/connection')
  .action(() => {
    console.log('Status')
    console.log('------')

    var status = generalSrv.getStatus()

    // connection status
    console.log('Connected: ' + status.connected)

    if (status.connected) {
      // coinbase info
      console.log('Coinbase: ' + status.coinbase)
      console.log('Coinbase balance: ' + status.coinbase_balance)
    }
  })

program
  .command('balance <account>')
  .description('Get the balance of an account')
  .action((account) => {
    console.log('Account: ' + account)

    addressSrv.getBalance(account)
      .then(function (result) {
        console.log('Account balance: ' + result.balance)
      }, function (err) {
        console.log('An error occurred: ' + err)
      })
  })

program
  .command('account-send <from> <to> <wei>')
  .description('Send ether (wei) from one account to another address')
  .action((from, to, wei) => {
    // prepare the Tx parameters
    var tx = {
      from: from,
      to: to,
      value: wei
    }

    web3.eth.sendTransaction(tx, (err, txHash) => {
      if (err) {
        console.log('Error creating tx: ' + err)
      } else {
        console.log('Tx hash: ' + txHash)
      }
    })
  })

program
  .command('send <from> <fromKey> <to> <wei>')
  .description('Send (wei) from an address to another')
  .option('-gp, --gas_price [price]', 'Gas price for the Tx')
  .option('-gl, --gas_limit [limit]', 'Gas price for the Tx')
  .action((from, fromKey, to, wei, options) => {
    console.log('Gas price: ' + (options.gas_price || 1))
    console.log('Gas limit: ' + (options.gas_limit || 90000))
    console.log('Value: ' + wei)
    console.log('Chain ID: ' + config.eth.chain_id)

    txSrv.send(from, fromKey, to, wei)
      .then(function (result) {
        console.log(result)
      }, function (err) {
        console.log(err)
      })

    // var result = await txSrv.send(from, fromKey, to, wei)
    // console.log(result);
  })

program
  .command('transaction <txhash>')
  .description('Gets the transaction information')
  .action((txhash) => {
    var tx = web3.eth.getTransaction(txhash)
    console.log('Transaction: ' + txhash)
    console.log(tx)
  })

program
  .command('block <blockid>')
  .description('Gets the block information')
  .option('-tx, --showtx', 'Include all transactions as objects')
  .action((blockid, options) => {
    var block = web3.eth.getBlock(blockid, options.showtx)
    console.log('Block: ' + blockid)
    console.log(block)
  })

program.parse(process.argv)

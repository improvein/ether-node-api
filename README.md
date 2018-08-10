Ethereum Node API
=================

This module provides an API for an Ethereum node by using [web3](https://github.com/ethereum/web3.js/). It does it in two flavors:
* HTTP RESTful API
* Console commands

Why?
This module is intended as an experiment, proof of concept (or however you want to call it), but it also can be helpful to use if you need HTTP REST API interaction with Ethereum instead of JSON RPC.

Install
-------
Just clone the repo and then install dependencies:
```bash
$ npm install
```

The install process creates a new `config.js` file in the root directory, based on the `config.js.default` file. There you can set up the parameters for running your instance.

### Configuration
(@TODO)

HTTP RESTful API
----------------
In order to start the HTTP API service you just need to run:
```bash
$ npm start
```
or
```bash
$ node api
```
You'll see a message indicating that the service is already running.

### Endpoints

The OpenAPI Specification for the REST API is in the [/docs/rest_api.yaml](/docs/rest_api.yaml) file

Also, this URL has an online UI for that documentation: https://app.swaggerhub.com/apis/improvein/ether-node-api/0.0.2

Console commands
----------------
In order to use the console you need to execute:
```bash
$ node cli [options] [command]
```

This is the list of commands (you can use the `--help` to find more info about each one)

* `status`

  See the status of the App and the network/connection
  
* `balance <account>`

  Get the balance of an account 

* `account-send <from> <to> <wei>`

  Send ether (wei) from one account to another address

* `send [options] <from> <fromKey> <to> <wei>`

  Send (wei) from an address to another

* `transaction <txhash>`

  Gets the transaction information

* `block [options] <blockid>`

  Gets the block information

Contributing
----------------
We encourage everyone to contribute to this project with requests, comments, suggestions and even code improvements.
Everything is welcome, just [report an issue](https://github.com/improvein/ether-node-api/issues) or [add a PR](https://github.com/improvein/ether-node-api/pulls).

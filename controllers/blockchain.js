const { BlockChain } = require('../models/blockchain');

let blockchain = new BlockChain();

module.exports = {
  createTransaction: (req, res, next) => {
    let required = ['sender', 'recipient', 'amount'];

    if(!req.body) return next({status:400,message: "Invalid data"});
    for (let item of required) {
      if (!req.body[item]) {
        return next({status:400,message:`${item} is required`});
      }
    }

    let block = blockchain.newTransaction(req.body.sender, req.body.recipient, req.body.amount);
    return res.json({status:1, message: `Transaction will be added in the block index - ${block}`});
  },

  getMine: (req, res, next) => {
    let last_proof = blockchain.lastBlock().proof;
    let proof = blockchain.proofOfWork(last_proof);
    let reward_transaction = {
      sender: '0',
      recipient: req.app.get('node_id'),
      amount: 1
    }
    blockchain.newTransaction(reward_transaction.sender, reward_transaction.recipient, reward_transaction.amount);
    
    let block = blockchain.newBlock(proof);
    let response = {
      status: 1,
      message: 'New Block Forged',
      index: block['index'],
      transactions: block['transactions'],
      proof: block['proof'],
      previous_hash: block['previous_hash'],
    }

    return res.json(response);
  },

  getChain: (req, res, next) => {
    let fullChain = {
      chain: blockchain.chain,
      length: blockchain.chain.length
    }
    return res.json(fullChain);
  },

  createRegister: (req, res, next) => {
    if (!req.body.nodes) {
      return next({status:400,message: 'Invalid Nodes List'});
    }

    req.body.nodes.map(node => blockchain.registerNode(node));
    return res.json({
      message: 'New Nodes have been added',
      total_nodes: [...blockchain.nodes]
    })
  },

  getResolve: (req, res, next) => {
    let response = {}
    blockchain.resolveConflict()
    .then(replaced => {
      if (replaced) {
        response.message = 'Our Chain was replaced',
        response.new_chain = blockchain.chain
      } else {
        response.message = 'Our chain is authoritative',
        response.chain = blockchain.chain
      }
      return res.json(response);
    })
    .catch(err => {return next(err)})
  }
}
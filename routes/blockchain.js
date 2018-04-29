const express = require('express');
const router  = express.Router();
const { createTransaction, getMine, getChain, createRegister, getResolve } = require('../controllers/blockchain')

router.post('/transaction/new', createTransaction)
router.get('/mine', getMine)
router.get('/chain', getChain)
router.post('/nodes/register', createRegister)
router.get('/nodes/resolve', getResolve)

module.exports = router;

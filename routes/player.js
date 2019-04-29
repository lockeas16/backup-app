const express       = require('express');
const server        = require('http').Server(express);
const io            = require('socket.io')(server)
const Campaign      = require('../models/Campaign');
const playControler = require('../helpers/bidPlayer')
const router        = express.Router();

router.get('/', (req, res) =>{
  res.render('player', {layout: false})
})

module.exports = router;
const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Client = require('../Models/Clients');


router.post('/', Client.ClientSchemas);
module.exports = router;

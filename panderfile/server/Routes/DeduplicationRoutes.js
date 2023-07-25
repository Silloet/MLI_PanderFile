const express = require('express');
const router = express.Router();


router.post('/', deduplicationController.deduplicateFiles);

module.exports = router;

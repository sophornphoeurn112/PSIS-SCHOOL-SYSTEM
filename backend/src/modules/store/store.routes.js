const express = require('express');
const storeController = require('./store.controller');

const router = express.Router();

router.get('/', storeController.getAll);
router.get('/:key', storeController.getByKey);
router.put('/:key', storeController.putByKey);

module.exports = router;

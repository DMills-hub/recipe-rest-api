const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const recipesController = require('../controllers/recipesController');

router.post('/save', isAuth, recipesController.save);

module.exports = router;
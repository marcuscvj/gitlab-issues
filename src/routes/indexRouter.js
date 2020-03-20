/**
 * Index routes.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

const express = require('express')
const router = express.Router()

const controller = require('../controllers/indexController')

router.get('/', controller.index)

module.exports = router

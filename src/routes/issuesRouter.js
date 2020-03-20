/**
 * Issues routes.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

const express = require('express')
const router = express.Router()

const controller = require('../controllers/issuesController')

router.post('/webhook', controller.webhook)

module.exports = router

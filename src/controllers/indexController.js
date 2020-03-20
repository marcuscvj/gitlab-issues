/**
 * IndexController.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

const indexController = {}

/**
 * Displays a start page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
indexController.index = (req, res) => {
  res.render('index', { layout: 'default' })
}

module.exports = indexController

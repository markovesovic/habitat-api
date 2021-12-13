const logger = require('../../common/logger');

module.exports = {
  notFound: async (req, res, _next) => {
    if(!req.route) {
      res.status(404).json({
        status: 'Not found',
        code: 404
      }).end();
    }
  },
  unknown: async (err, _req, res, _next) => {
    logger.error(err.stack);

    res.status(500).json({
      status: 'Server error',
      code: 500
    }).end();
  }
}

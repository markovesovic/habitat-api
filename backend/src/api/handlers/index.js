const logger = require('../../common/logger');

module.exports = {
  log: async (req, res, next) => {
    const startTime = process.hrtime();

    res.on('finish', () => {
      const elapsedTime = process.hrtime(startTime);
      const elapsedTimeInMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6;
      logger.info(`Elapsed time: ${elapsedTimeInMs}ms`);
    });

    next();
  },
  notFound: async (req, res) => {
    if (!req.route) {
      res
        .status(404)
        .json({
          status: 'Not found',
          code: 404,
        })
        .end();
    }
  },
  unknown: async (err, _req, res) => {
    logger.error(err.stack);

    res
      .status(500)
      .json({
        status: 'Server error',
        code: 500,
      })
      .end();
  },
};

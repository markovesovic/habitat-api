const router = require('express').Router();
const services = require('../../common/services');
const logger = require('../../common/logger');

router.post('/properties', async (req, res, next) => {
  try {
    const start = process.hrtime();

    let page = req.query.page ? +req.query.page : 1;
    if (page < 0) {
      page = 1;
    }
    const perPage = req.query.perPage ? +req.query.perPage : 20;

    const { totalMatches, data } = await services.ram.getProperties(req.body, page, perPage);

    const end = process.hrtime(start);
    logger.info(`Execution time: ${end[0]}s ${end[1] / 1000000}ms`);

    res
      .status(200)
      .json({
        status: 'Success',
        totalMatches,
        page,
        perPage,
        data,
      })
      .end();
  } catch (err) {
    next(err);
  }
});

router.get('/properties/count', async (_req, res, next) => {
  try {
    const numsPerCategory = await services.ram.getNumberOfPropertiesPerCategory();
    res
      .status(200)
      .json({
        status: 'Success',
        numsPerCategory,
      })
      .end();
  } catch (err) {
    next(err);
  }
});

router.get('/property/:id', async (req, res, next) => {
  try {
    const propertyID = +req.params.id;

    const property = await services.ram.getProperty(propertyID);

    if (property) {
      res
        .status(200)
        .json({
          status: 'Success',
          property,
        })
        .end();
      return;
    }

    res
      .status(404)
      .json({
        status: 'Property not found',
      })
      .end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

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
    let perPage = req.query.perPage ? +req.query.perPage : 20;
    perPage = perPage > 100 ? 100 : perPage;

    logger.info(`page: ${page}, perPage:${perPage}`);

    const { results, totalMatches } = await services.getProperties(req.body, page, perPage);

    // const pricesAndAreas = [];
    // results.forEach(result => {
    //   pricesAndAreas.push({
    //     price: result.price,
    //     area: result.square_areas[0] ? result.square_areas[0].area : 'none',
    //     rating: result.rating,
    //   });
    // });

    const end = process.hrtime(start);
    logger.info(`Execution time: ${end[0]}s ${end[1] / 1000000}ms`);

    res
      .status(200)
      .json({
        status: 'Success',
        totalMatches,
        page,
        perPage,
        data: results,
      })
      .end();
  } catch (err) {
    next(err);
  }
});

router.get('/properties/count', async (_req, res, next) => {
  try {
    const numsPerCategory = await services.getNumberOfPropertiesPerCategory();
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

router.post('/property', async (req, res, next) => {
  try {
    const property = req.body;

    const publicID = await services.db.addProperty(property);

    if (publicID) {
      res.status(200).json({ status: 'Success', publicID }).end();
      return;
    }
    res.status(400).json({ status: 'Failed' });
  } catch (err) {
    next(err);
  }
});

router.get('/property/:id', async (req, res, next) => {
  try {
    const propertyID = req.params.id;

    const property = await services.db.getProperty(propertyID);

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

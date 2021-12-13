const services = require('../../common/services');
const logger = require('../../common/logger');
const router = require('express').Router();

router.post('/properties', async (req, res, next) => {
  const start = process.hrtime();



  const end = process.hrtime(start);
  logger.info(`Execution time: ${end[0]}s ${end[1] / 1000000}ms`);
});

router.get('/property/:id', async (req, res, next) => {
  const propertyID = +req.params.id;

  const property = await services.ram.getProperty(propertyID);

  if (property) {
    res.status(200).json({
      status: 'Success',
      property: property
    }).end();
    return;
  }

  res.status(404).json({
    status: 'Property not found',
  }).end();

});

module.exports = router;

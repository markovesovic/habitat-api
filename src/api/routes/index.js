const router = require('express').Router();
const services = require('../../common/services');

router.post('/properties', async (req, res, next) => {
  try {
    let page = req.query.page ? +req.query.page : 1;
    if (page < 0) {
      page = 1;
    }
    let perPage = req.query.perPage ? +req.query.perPage : 20;
    perPage = perPage > 100 ? 100 : perPage;

    // const data = await services.getProperties(req.body, page, perPage);
    // const count = await services.getPropertiesCount(req.body);

    const result = await Promise.all([
      services.getProperties(req.body, page, perPage),
      services.getPropertiesCount(req.body),
    ]);

    const data = result[0];
    const count = result[1];

    if (data) {
      res
        .status(200)
        .json({
          status: 'Success',
          page,
          perPage,
          count,
          data,
        })
        .end();
      return;
    }
    res.status(400).json({ status: 'Failed' }).end();
  } catch (err) {
    next(err);
  }
});

router.get('/property/:id', async (req, res, next) => {
  try {
    const propertyID = req.params.id;

    const property = await services.getProperty(propertyID);

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

// router.get('/properties/count', async (_req, res, next) => {
//   try {
//     const numsPerCategory = await services.getNumberOfPropertiesPerCategory();
//     res
//       .status(200)
//       .json({
//         status: 'Success',
//         numsPerCategory,
//       })
//       .end();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;

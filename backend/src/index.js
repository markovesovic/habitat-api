const express = require('express');
const cors = require('cors');
const config = require('./config').default;
const logger = require('./common/logger');
const router = require('./api/routes');
const handlers = require('./api/handlers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (config.get('NODE_ENV') !== 'production') {
  app.use(async (req, _res, next) => {
    logger.info(`Accessed route ${req.url}`);
    next();
  });
}

app.use('/', router);

app.use(handlers.notFound);
app.use(handlers.unknown);

app.set('PORT', config.get('PORT') || 3000);

app.listen(app.get('PORT'), () => {
  logger.info(`Running on ${app.get('PORT')} port`);
});

module.exports = {};

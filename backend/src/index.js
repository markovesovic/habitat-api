const config = require('./config');
const logger = require('./common/logger');
const express = require('express');

const app = express();

app.set('PORT', config.get('PORT') || 3000);

app.listen(app.get('PORT'), () => {
  logger.info(`Running on ${app.get('PORT')} port`);
});

module.exports = {};
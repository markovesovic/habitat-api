const { v4: uuidV4 } = require('uuid');
const logger = require('../../logger');
const { db } = require('../../data');

const addProperty = async property => {
  property.public_id = uuidV4();

  await db.client('properties').insert(property);
  return property.public_id;
};

const getProperty = async id => {
  const property = await db.client('properties').findOne({ public_id: id });
  return property;
};

const getProperties = async (body, page, perPage) => {
  const query = body.params;

  // Check for area size
  if (body.size_max && body.size_min) {
    query['square_areas.0.area'] = { $lt: body.size_max, $gt: body.size_min };
  } else if (body.size_min) {
    query['square_areas.0.area'] = { $gt: body.size_min };
  } else if (body.size_max) {
    query['square_areas.0.area'] = { $lt: body.size_max };
  }

  // Check for price
  if (body.price_max && body.price_min) {
    query.price = { $lt: body.price_max, $gt: body.price_min };
  } else if (body.price_max) {
    query.price = { $gt: body.price_min };
  } else if (body.price_min) {
    query.price = { $lt: body.price_max };
  }

  // Choose sorting option if any
  let sort = {};
  if (body.sort === 'asc') {
    sort = { price: 1 };
  } else if (body.sort === 'desc') {
    sort = { price: -1 };
  } else if (body.sort === 'rating') {
    sort = { rating: -1 };
  }

  // Chose how many entries to skip
  const skip = perPage * (page - 1);

  logger.info(`query: ${JSON.stringify(query)}`);
  logger.info(`sort: ${JSON.stringify(sort)}`);
  const results = await db.client('properties').find(query, sort, skip, perPage);
  const totalMatches = await db.client('properties').count(query);
  return { results, totalMatches };
};

module.exports = {
  addProperty,
  getProperty,
  getProperties,
};

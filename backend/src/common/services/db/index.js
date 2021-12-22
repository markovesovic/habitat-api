const { v4: uuidV4 } = require('uuid');
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

module.exports = {
  addProperty,
  getProperty,
};

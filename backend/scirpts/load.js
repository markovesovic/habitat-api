const fs = require('fs');
const logger = require('../src/common/logger');

const db = require('../src/common/db');

const readPropertiesFromJson = async () => {
  const properties = [];

  const data = fs.readFileSync('./habitat_db.json', 'utf-8');

  const content = data.toString();
  const lines = content.split('\n');

  for (let i = 0; i < lines.length - 1; i += 1) {
    const item = JSON.parse(lines[i]);
    properties.push(item);
    logger.info(item);
  }

  logger.info(`post read ${properties}`);
  return properties;
};

const sleep = async ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const main = async () => {
  try {
    const properties = await readPropertiesFromJson();
    const propertyPromises = [];

    for (let idx = 0; idx < properties.length; idx += 1) {
      propertyPromises.push(db.addProperty(properties[idx]));
      await sleep(500);
    }

    const result = await Promise.all(propertyPromises);
    logger.info(`Result: ${result}`);
  } catch (err) {
    logger.error(JSON.stringify(err));
  }
  process.exit(1);
};

main();

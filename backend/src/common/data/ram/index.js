const fs = require('fs');
const logger = require('../../logger');

const properties = {
  list: [],
  set: {},
};
let init = false;

const initProperties = () => {
  fs.readFile('./habitat_db.json', (err, data) => {
    if (err) {
      logger.crit(err);
      return;
    }

    const content = data.toString();
    const lines = content.split('\n');

    for (let i = 0; i < lines.length - 1; i += 1) {
      const item = JSON.parse(lines[i]);
      properties.list.push(item);
      properties.set[item.private_id] = item;
    }
  });
};

if (!init) {
  initProperties();
  init = true;
}

module.exports = properties;

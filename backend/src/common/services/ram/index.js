const properties = require('../../data/ram');

const getProperty = async id => {
  if (id) {
    return properties.set[id];
  }
  return undefined;
};

const getProperties = async (body, page, perPage) => {
  const data = [];

  for (let i = 0; i < properties.list.length; i += 1) {
    const property = properties.list[i];
    let found = true;

    if (body.params) {
      for (const attribute in body.params) {
        if (property[attribute] !== body.params[attribute]) {
          found = false;
          break;
        }
      }
    }

    if (!found) {
      continue;
    }

    if (!property.square_areas[0]) {
      continue;
    }

    if (body.min_area) {
      if (property.square_areas[0].area < body.min_area) {
        continue;
      }
    }

    if (body.max_area) {
      if (property.square_areas[0].area > body.max_area) {
        continue;
      }
    }

    if (body.min_price) {
      if (property.price < body.min_price) {
        continue;
      }
    }

    if (body.max_price) {
      if (property.price > body.max_price) {
        continue;
      }
    }

    data.push(property);
  }

  const totalMatches = data.length;

  if (body.sort) {
    if (body.sort === 'asc') {
      data.sort((a, b) => a.price - b.price);
    }

    if (body.sort === 'desc') {
      data.sort((a, b) => b.price - a.price);
    }

    if (body.sort === 'rating') {
      data.sort((a, b) => b.rating - a.rating);
    }
  }

  const startIndex = (page - 1) * perPage;
  let endIndex = page * perPage;

  if (startIndex > totalMatches) {
    return {
      totalMatches,
      data: [],
    };
  }

  if (endIndex > totalMatches) {
    endIndex = totalMatches;
  }

  return {
    totalMatches,
    data: data.slice(startIndex, endIndex),
  };
};

const getNumberOfPropertiesPerCategory = async () => {
  const numberOfPropertiesPerCategory = {
    elevator: 0,
    garage: 0,
    parking: 0,
    terrace: 0,
    yard: 0,
    swimming_pool: 0,
    doorkeeper: 0,
    building_security: 0,
  };

  for (let i = 0; i < properties.list.length; i += 1) {
    if (numberOfPropertiesPerCategory[properties.list[i].building_type]) {
      numberOfPropertiesPerCategory[properties.list[i].building_type] += 1;
    } else {
      numberOfPropertiesPerCategory[properties.list[i].building_type] = 1;
    }

    for (const param in numberOfPropertiesPerCategory) {
      if (properties.list[i][param] === true) {
        numberOfPropertiesPerCategory[param] += 1;
      }
    }
  }
  return numberOfPropertiesPerCategory;
};

module.exports = {
  getProperty,
  getProperties,
  getNumberOfPropertiesPerCategory,
};

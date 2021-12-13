const properties = require('../../data/ram');

const getProperty = async id => {
  if(id) {
    return properties.set[id];
  }
}

const getProperties = async (body, page, perPage) => {
  let data = [];

  for (let i = 0; i < properties.list.length; i++) {
    
    let property = properties.list[i];
    let found = true;
    
    if (body.params) {
      for (let attribute in body.params) {
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
      if(property.price > body.max_price) {
        continue;
      }
    }


    data.push(property);
  }
  
  const totalMatches = data.length;

  if (body.sort) {

    if (body.sort === 'asc') {
      data.sort( (a, b) => {
        return a.price - b.price;
      });
    }

    if(body.sort === 'desc') {
      data.sort( (a, b) => {
        return b.price - a.price;
      });
    }

    if(body.sort === 'rating') {
      data.sort( (a, b) => {
        return b.rating - a.rating;
      });
    }
  }

  let startIndex = (page - 1) * perPage;
  let endIndex = page * perPage;

  if (startIndex > totalMatches) {
    return {
      totalMatches: totalMatches,
      data: [],
    }
  }

  if (endIndex > totalMatches) {
    endIndex = totalMatches;
  }

  return {
    totalMatches: totalMatches,
    data: data.slice(startIndex, endIndex)
  }

}

const getNumberOfPropertiesPerCategory = async () => {
  let numberOfPropertiesPerCategory = {
    elevator: 0,
    garage: 0,
    parking: 0,
    terrace: 0,
    yard: 0,
    swimming_pool: 0,
    doorkeeper: 0,
    building_security: 0
  };

  for (let i = 0; i < properties.list.length; i++) {
    numberOfPropertiesPerCategory[properties.list[i].building_type] ?
      numberOfPropertiesPerCategory[properties.list[i].building_type] = numberOfPropertiesPerCategory[properties.list[i].building_type] + 1 :
      numberOfPropertiesPerCategory[properties.list[i].building_type] = 1;

    for (let param in numberOfPropertiesPerCategory) {
      if (properties.list[i][param] === true) {
        numberOfPropertiesPerCategory[param]++;
      }
    }
  }
  return numberOfPropertiesPerCategory;
}

module.exports = {
  getProperty,
  getProperties,
  getNumberOfPropertiesPerCategory
}

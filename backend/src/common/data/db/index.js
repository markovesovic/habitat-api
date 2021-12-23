const { MongoClient } = require('mongodb');
const config = require('../../../config');

const mongoConnection = {
  collections: {},

  _init: collectionName => {
    if (mongoConnection.collections[collectionName] === undefined) {
      return new Promise((resolve, reject) => {
        MongoClient.connect(
          config.get('MONGODB_URL'),
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
          (err, client) => {
            if (err) {
              return reject(err);
            }

            const db = client.db(config.get('MONGODB_URL').split('/').pop());
            mongoConnection.collections[collectionName] = db.collection(collectionName);

            resolve(mongoConnection.collections[collectionName]);
          }
        );
      });
    }
    return Promise.resolve(mongoConnection.collections[collectionName]);
  },
};

module.exports = {
  client: collectionName => {
    const collectionPromise = new Promise((resolve, reject) => {
      mongoConnection
        ._init(collectionName)
        .then(collection => {
          resolve(collection);
        })
        .catch(err => {
          reject(err);
        });
    });

    return {
      find: (filter, sort, page, perPage) =>
        new Promise((resolve, reject) => {
          collectionPromise.then(collection => {
            if (sort) {
              collection
                .find(filter)
                .sort(sort)
                .skip(page)
                .limit(perPage)
                .toArray((err, results) => {
                  if (err) {
                    return reject(err);
                  }

                  resolve(results);
                });
            } else {
              collection.find(filter).toArray((err, results) => {
                if (err) {
                  return reject(err);
                }

                resolve(results);
              });
            }
          });
        }),

      findOne: filter =>
        new Promise((resolve, reject) => {
          collectionPromise.then(collection => {
            collection
              .find(filter)
              .limit(1)
              .toArray((err, results) => {
                if (err) {
                  return reject(err);
                }

                if (results.length === 1) {
                  resolve(results[0]);
                } else {
                  resolve(null);
                }
              });
          });
        }),

      del: filter =>
        new Promise((resolve, reject) => {
          collectionPromise.then(collection => {
            collection.deleteMany(filter, (err, results) => {
              if (err) {
                return reject(err);
              }

              resolve(results);
            });
          });
        }),

      insert: object =>
        new Promise((resolve, reject) => {
          collectionPromise.then(collection => {
            collection.insertOne(object, (err, results) => {
              if (err) {
                return reject(err);
              }

              resolve(results);
            });
          });
        }),

      count: filter =>
        new Promise(resolve => {
          collectionPromise.then(collection => {
            resolve(collection.find(filter).count());
          });
        }),
    };
  },
};

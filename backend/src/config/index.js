const config = {
  _config: {},

  set: (name, value) => {
    config[name] = value;
    return value;
  },

  get: name => config.set(name, config._config[name] || config._getEnv(name)),

  _getEnv: name => process.env[name],
};
if (config.get('NODE_ENV') !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

module.exports = config;

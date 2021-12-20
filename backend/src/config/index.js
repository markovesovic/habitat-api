const config = {
  _config: {},

  set: (name, value) => {
    config[name] = value;
    return value;
  },

  get: name => {
    return config.set(name, config._config[name] || config._getEnv(name));
  },

  _getEnv: name => {
    return process.env[name];
  },
};

if (config.get('NODE_ENV') !== 'production') {
  require('dotenv').config();
}

module.exports = config;

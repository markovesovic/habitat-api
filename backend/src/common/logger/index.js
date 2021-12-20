const winston = require('winston');
const config = require('../../config');

const transports = {
  console: new winston.transports.Console({
    level: config.get('NODE_ENV') === 'production' ? 'info' : 'debug',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    stderrLevels: ['error', 'crit', 'alert', 'emerg'],
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss:SSS',
      }),
      winston.format.colorize(),
      winston.format.printf(info => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
      })
    ),
  }),
};

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports: [transports.console],
});

logger.stream = {
  write: message => {
    logger.info(typeof message === 'string' ? message.trim() : message);
  },
};

module.exports = logger;

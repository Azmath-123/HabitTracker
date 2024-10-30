const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'reminder-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'reminder-combined.log' })
    ]
});

const logReminderEvent = (type, habitId, status, details) => {
    logger.info({
        type,
        habitId,
        status,
        timestamp: new Date(),
        details
    });
};

module.exports = { logReminderEvent };
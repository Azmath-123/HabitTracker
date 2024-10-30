const moment = require('moment-timezone');

const convertToUserTimezone = (time, userTimezone) => {
    return moment.tz(time, userTimezone).format();
};

const getReminderTimeInUTC = (localTime, userTimezone) => {
    return moment.tz(localTime, userTimezone).utc().format();
};

module.exports = { convertToUserTimezone, getReminderTimeInUTC };
const {getConfigKey} = require('./options.js');

const timeouts = [];

function setUserTimeout(userId) {
    const timeoutTime = getConfigKey('discord.ratings.timeout');
    const timeout = {
        userId: userId,
        expiresAt: Date.now() + timeoutTime
    };
    timeouts.push(timeout);
}

function checkUserTimeout(userId) {
    const currentTime = Date.now();
    const timeout = timeouts.find(t => t.userId === userId);
    if (timeout) {
        return timeout.expiresAt > currentTime;
    }
    return false;
}

module.exports = {setUserTimeout, checkUserTimeout};

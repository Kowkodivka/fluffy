const {getConfigKey} = require('./options.js');
const {Client} = require('discord.js-selfbot-v13');
const {deployEvents, deployCommands} = require('./deploy');

const client = new Client({
    checkUpdate: false,
});

module.exports = {client};

deployEvents(client);
deployCommands(client);

client.login(getConfigKey('discord.secret.token'))
    .catch((reason) => console.log(`Ошибка во время включения бота: ${reason}`));
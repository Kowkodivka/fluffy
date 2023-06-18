const {client} = require("../../index");

module.exports = {
    name: 'отключить',
    manage: true,
    description: 'Экстренное отключение бота.',
    execute() {
        client.destroy();
    }
};
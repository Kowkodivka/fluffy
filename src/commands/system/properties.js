const {getAllConfigKeys} = require('../../options.js');

module.exports = {
    name: 'параметры',
    manage: true,
    description: 'Выводит все доступные параметры из конфигурационного файла.',
    async execute(message, args) {
        const configKeys = getAllConfigKeys();
        const response = configKeys.map(({key, value}) => `- \`${key}\`: ${value}`).join('\n');
        await message.reply(`Все доступные параметры:\n${response}`);
    }
};

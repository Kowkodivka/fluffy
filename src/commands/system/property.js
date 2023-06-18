const {getConfigKey, setConfigKey} = require('../../options.js');

module.exports = {
    name: 'параметр',
    manage: true,
    parameters: 'ключ, режим, параметры...',
    description: 'Осуществить действие с параметром в конфигурационном файле.',
    async execute(message, args) {
        const [key, mode, ...params] = args;
        const value = getConfigKey(key);

        if (key.includes('secret')) {
            await message.reply('У вас нет доступа к данному параметру.');
            return;
        }

        switch (mode) {
            case 'изменить':
                if (value === undefined) {
                    await message.reply('Параметр не найден в конфигурации.');
                } else {
                    setConfigKey(key, parseValue(params, value));
                    await message.reply(`Параметр "${key}" изменен на "${params.join(' ')}".`);
                }
                break;
            case 'получить':
                if (value === undefined) {
                    await message.reply('Параметр не найден в конфигурации.');
                } else {
                    await message.reply(`\`\`\`${parseValue(value)}\`\`\``);
                }
                break;
            default:
                await message.reply('Укажите режим "изменить" или "получить".');
        }
    }
};

function parseValue(params, currentValue) {
    const value = Array.isArray(params) ? params.join(' ') : params;

    if (value === 'true' || value === 'false') {
        return value === 'true';
    } else if (!isNaN(value)) {
        return parseFloat(value);
    } else if (currentValue instanceof Array) {
        if (value.startsWith('добавить:')) {
            const element = value.substr(9);
            const newValueArray = [...currentValue];
            newValueArray.push(element);
            return newValueArray;
        } else if (value.startsWith('удалить:')) {
            const element = value.substr(8); // Исправлено: удалить префикс "удалить:"
            return currentValue.filter(item => item !== element);
        } else if (value.startsWith('[') && value.endsWith(']')) {
            return JSON.parse(value);
        }
    }

    return value;
}


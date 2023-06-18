const {getConfigKey} = require('../../options.js');
const {client} = require("../../index");

module.exports = {
    once: false,
    name: 'messageCreate',
    async execute(message) {
        const prefix = getConfigKey('discord.prefix');
        const allowedUsers = getConfigKey('management.managers');

        if (!message.content.startsWith(prefix) || message.author.bot || message.author.id === client.user.id) return;

        if (message.channel.id !== getConfigKey('discord.botChannel') && message.channel.type !== 'DM') {
            await message.react('❌');
            return;
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (getConfigKey('management.disabledCommands').includes(command)) {
            await message.reply('Команда отключена.');
            return;
        }

        if (!client.commands.has(command)) {
            await message.reply(`Не существующая команда: \`${command}\``);
            return;
        }

        const prefixCommand = client.commands.get(command);

        if (prefixCommand.manage && !allowedUsers.includes(message.author.id)) {
            await message.reply('Недостаточно прав для использования команды.');
            return;
        }

        try {
            await prefixCommand.execute(message, args);
        } catch (error) {
            await message.reply(`Ошибка во время выполнения команды: ${error}`);
        }
    }
}
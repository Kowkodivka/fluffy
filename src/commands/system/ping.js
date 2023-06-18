module.exports = {
    name: 'пинг',
    description: 'Понг!',
    async execute(message, args) {
        await message.reply('Понг!');
    }
}
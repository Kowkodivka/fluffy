module.exports = {
    name: 'хелп',
    description: 'Все доступные команды бота.',
    async execute(message) {
        const commands = message.client.commands;
        const categories = {};

        commands.forEach((command) => {
            const category = command.category || 'Без категории';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(command);
        });

        let helpMessage = 'Вот все доступные команды:\n';

        Object.entries(categories).forEach(([category, commandList]) => {
            const capitalizedCategory = category
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            helpMessage += `**${capitalizedCategory}**:\n`; // Добавление порядкового номера
            commandList.forEach((command) => {
                helpMessage += `- **${command.name}**: ${command.description} ${command.parameters ? `\n\t- Параметры: \`${command.parameters}\`` : ''}\n`;
            });
            helpMessage += '\n';
        });

        await message.reply(helpMessage);
    }
};

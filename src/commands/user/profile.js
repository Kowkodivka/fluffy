const {saveUser, getUserById} = require("../../store");

module.exports = {
    name: 'профиль',
    parameters: 'айди/пинг',
    description: 'Показывает профиль пользователя.',
    async execute(message, args) {
        let userId = args[0];

        if (userId === undefined) {
            userId = message.author.id;
            const user = getUserById(userId);
            if (!user) {
                const newUser = {id: userId, rating: 0, experience: 0};
                saveUser(newUser);
                await message.reply(`**Ваш профиль:**\n- Социальный рейтинг: ${newUser.rating}\n- Опыт: ${newUser.experience}`);
            } else {
                await message.reply(`**Ваш профиль:**\n- Социальный рейтинг: ${user.rating}\n- Опыт: ${user.experience}`);
            }
        } else {
            const pingRegex = /<@!?(\d+)>/; // Регулярное выражение для извлечения айди из пинга
            const match = userId.match(pingRegex);
            if (match) {
                userId = match[1];
            }
            const user = getUserById(userId);
            if (user == null) {
                await message.reply("Пользователь не найден.");
            } else {
                await message.reply(`**Профиль пользователя \`${userId}\`:**\n- Социальный рейтинг: ${user.rating}\n- Опыт: ${user.experience}`);
            }
        }
    }
};

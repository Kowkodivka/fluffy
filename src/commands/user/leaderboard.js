const {getUsers} = require('../../store');

function sortUsersByRating(users) {
    return users.sort((a, b) => b.rating - a.rating);
}

function sortUsersByExperience(users) {
    return users.sort((a, b) => b.experience - a.experience);
}

module.exports = {
    name: 'лидеры',
    parameters: 'рейтинг/опыт',
    description: 'Показывает профили с наибольшим количеством рейтинга или опыта.',
    async execute(message, args) {
        const users = getUsers();
        const sortBy = args[0];

        const sent = await message.reply('Думаю...');

        let page = parseInt(args[1]);

        if (!page || isNaN(page) || page < 1) {
            page = 1;
        }

        const pageSize = 20;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        if (sortBy === 'рейтинг' || sortBy === 'опыт') {
            const sortedUsers = sortBy === 'рейтинг' ? sortUsersByRating(users) : sortUsersByExperience(users);

            const leaderboard = sortedUsers.slice(startIndex, endIndex).map(async (user, index) => {
                const position = `${startIndex + index + 1}.`.padEnd(4, ' ');

                let username;
                try {
                    const fetchedUser = await message.client.users.fetch(user.id);
                    let trimmedUsername = fetchedUser.username.substring(0, 20);
                    if (fetchedUser.username.length > 20) {
                        trimmedUsername = `${trimmedUsername.slice(0, -1)}`;
                    }
                    username = trimmedUsername.padEnd(20, ' ');
                } catch (error) {
                    username = `<@${user.id}>`.padEnd(20, ' ');
                }

                const ratingOrExperience = sortBy === 'рейтинг' ? user.rating : user.experience;
                return `${position} ${username}\t${ratingOrExperience}`;
            });

            const leaderboardPage = await Promise.all(leaderboard);

            if (leaderboardPage.length > 0) {
                const totalPages = Math.ceil(sortedUsers.length / pageSize);
                const currentPage = Math.min(page, totalPages);

                await sent.edit(`**Топ пользователей по ${sortBy}у (Страница ${currentPage}/${totalPages}):**\n\`\`\`\n${leaderboardPage.join('\n')}\n\`\`\``);
            } else {
                await sent.edit(`На указанной странице нет данных.`);
            }
        } else {
            await sent.edit('Укажите параметр "рейтинг" или "опыт".');
        }
    },
};

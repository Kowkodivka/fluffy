const {getConfigKey} = require("../../options");
module.exports = {
    once: true,
    name: 'ready',
    async execute(client) {
        console.log(`${client.user.username} готов к работе`);

        client.user.presence.set({
            status: 'idle',
            activities: [{
                name: "Fluffy",
                details: `Префикс: ${getConfigKey('discord.prefix')}`,
                buttons: [{
                    name: "Github",
                    url: "https://github.com/Kowkodivka/fluffy"
                }]
            }],
        });
    }
}
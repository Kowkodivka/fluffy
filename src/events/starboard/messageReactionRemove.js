const {getConfigKey} = require("../../options.js");
const {client} = require('../../index.js');
const {containsMessage, getBotMessage, removeMessage} = require('../../store.js');
const {getMessage} = require("../../store");

module.exports = {
    once: false,
    name: 'messageReactionRemove',
    async execute(reaction, _) {
        if (!getConfigKey('discord.starboard.enabled')) return;

        const channelID = getConfigKey('discord.starboard.channelID');
        const reactionThreshold = getConfigKey('discord.starboard.reactionThreshold');

        const message = await reaction.message.fetch();
        const starboardChannel = await client.channels.fetch(channelID);

        if (message.author.id === client.user.id || reaction.emoji.name !== '⭐') return;

        const stars = reaction.count;

        if (stars < reactionThreshold && containsMessage(message.id)) {
            const botMessageId = getBotMessage(message.id);
            const botMessage = await starboardChannel.messages.fetch(botMessageId);
            if (botMessage) {
                await botMessage.delete().then((deleted) => {
                    if (deleted) {
                        removeMessage(message.id);
                    }
                });
            }
        } else if (containsMessage(message.id)) {
            const botMessageId = getBotMessage(message.id);
            const botMessage = await starboardChannel.messages.fetch(botMessageId);
            if (botMessage) {
                let content = botMessage.content;
                const starCount = `**${stars} :star: ${message.author.username}**`;
                content = content.replace(/^\*\*\d+ :star: .+\*\*/i, starCount);
                await botMessage.edit(content);
            }
        }
    }
};

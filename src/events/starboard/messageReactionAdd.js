const {getConfigKey} = require('../../options.js');
const {client} = require('../../index.js');
const {containsMessage, saveMessage, getBotMessage} = require('../../store.js');

module.exports = {
    once: false,
    name: 'messageReactionAdd',
    async execute(reaction, _) {
        if (!getConfigKey('discord.starboard.enabled')) return;

        const channelID = getConfigKey('discord.starboard.channelID');
        const reactionThreshold = getConfigKey('discord.starboard.reactionThreshold');

        const message = await reaction.message.fetch();
        const starboardChannel = await client.channels.fetch(channelID);

        if (message.author.id === client.user.id || reaction.emoji.name !== '⭐') return;

        const stars = reaction.count;

        if (stars >= reactionThreshold && !containsMessage(message.id)) {
            let content = `**${stars} :star: ${message.author.username}**`;
            if (message.content) {
                content += `\n> ${message.content.replace('@', '(@)')}`;
            }
            content += `\n:satellite: **Перейти к сообщению:** ${message.url}`;

            let attachments = '';
            if (message.attachments.size > 0) {
                attachments = `🖼️ **Вложения:**\n${message.attachments.map((attachment) => attachment.url).join('\n')}`;
            }

            const starboardMessage = `${content}\n${attachments}`;

            await starboardChannel.send(starboardMessage).then((sent) => {
                if (sent) {
                    saveMessage(message.id, sent.id);
                }
            });
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
    },
};

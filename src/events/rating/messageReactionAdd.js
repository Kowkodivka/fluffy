const {getConfigKey} = require("../../options");
const {increaseUserRating, decreaseUserRating} = require("../../store");
const {checkUserTimeout, setUserTimeout} = require("../../timeouts");

module.exports = {
    once: false,
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (!getConfigKey('discord.ratings.enabled')) return;

        const message = await reaction.message.fetch();
        const isInTimeout = checkUserTimeout(user.id);

        if (isInTimeout || user.bot || message.author.id === user.id) return;

        const userId = message.author.id;

        switch (reaction.emoji.identifier) {
            case getConfigKey('discord.ratings.emojiUp'):
                setUserTimeout(user.id);
                increaseUserRating(userId);
                break;
            case getConfigKey('discord.ratings.emojiDown'):
                setUserTimeout(user.id);
                decreaseUserRating(userId);
                break;
        }
    }
}

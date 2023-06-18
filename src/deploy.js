const fs = require("fs");
const path = require("path");
const {getConfigKey} = require('./options.js');
const Discord = require('discord.js-selfbot-v13');

const deployCommands = (client) => {
    const commandFolders = path.join(__dirname, 'commands');
    client.commands = new Discord.Collection();

    const readCommandFiles = (folder) => {
        const commandsPath = path.join(commandFolders, folder);
        fs.readdirSync(commandsPath)
            .filter((file) => file.endsWith('.js'))
            .forEach((file) => {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('name' in command && 'description' in command && 'execute' in command) {
                    command.category = folder;
                    client.commands.set(command.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "name", "description" or "execute" property.`);
                }
            });
    };

    fs.readdirSync(commandFolders).forEach(readCommandFiles);
};

const deployEvents = (client) => {
    const eventFolders = path.join(__dirname, 'events');

    const readEventFiles = (folder) => {
        const eventsPath = path.join(eventFolders, folder);
        fs.readdirSync(eventsPath)
            .filter((file) => file.endsWith('.js'))
            .forEach((file) => {
                const filePath = path.join(eventsPath, file);
                const event = require(filePath);
                if ('name' in event && 'execute' in event) {
                    if (event.once) {
                        client.once(event.name, (...args) => {
                            if (getConfigKey('management.disabledEvents').includes(event.name)) return;
                            event.execute(...args)
                        });
                    } else {
                        client.on(event.name, (...args) => {
                            if (getConfigKey('management.disabledEvents').includes(event.name)) return;
                            event.execute(...args)
                        });
                    }
                } else {
                    console.log(`[WARNING] The event at ${filePath} is missing a required "once" or "execute" property.`);
                }
            });
    };

    fs.readdirSync(eventFolders).forEach(readEventFiles);
};

module.exports = {deployEvents, deployCommands};

require('dotenv').config();
require('./extenders/Guild');
const fs = require('fs');
const BotClient = require('./structures/Client');

const client = new BotClient();
try {
    fs.readdirSync('./commands').forEach(async (category) => {
        fs.readdir(`./commands/${category}/`, (err) => {
            if (err) return console.error(err);
            const Commands = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));

            for (const file of Commands) {
                const cmd = require(`./commands/${category}/${file}`);
                client.commands.set(cmd.name, cmd);

                if (cmd.aliases && Array.isArray(cmd.aliases)) { cmd.aliases.forEach(aliases => client.aliases.set(aliases, cmd.name)); }
            }
        });
    });
}
catch (er) {
    console.log(`Error In ${er}`);
}
client.eventInit();
client.login(process.env.TOKEN ? process.env.TOKEN : client.config.token);

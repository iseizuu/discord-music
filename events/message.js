const { Collection } = require('discord.js');

/**
 * @param {import("../structures/Client")} client;
 * @param {import("discord.js").Message} msg;
 */
module.exports = async (client, msg) => {
    if (msg.author.bot) return;
    if (!msg.guild) return;
    const prefix = client.config.prefix;
    if (!msg.content.startsWith(prefix)) return;
    if (!msg.member) msg.member = await msg.guild.fetchMember(msg);

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (!cmd.length) return;
    let cmds = client.commands.get(cmd);
    if (!cmds) cmds = client.commands.get(client.aliases.get(cmd));
    if (cmds) {
        console.log(`${msg.author.tag} used ${cmds.name}`);
    }

    try {
        if (!client.cooldowns.has(cmds.name)) {
            client.cooldowns.set(cmds.name, new Collection());
        }
        const now = Date.now();
        const timestamps = client.cooldowns.get(cmds.name);
        let cooldownAmount = (cmds.cooldown || 3) * 1000;
        if (client.config.owners.includes(msg.author.id)) cooldownAmount = 0 * 1000;
        if (timestamps.has(msg.author.id)) {
            const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return msg.channel.send(`Hold on, ${timeLeft.toFixed(1)} To used \`${cmds.name}\`again.`);
            }
        }
        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
    }
    catch (er) {
        console.log(`${msg.author.tag} using ghost command LMAO :P`);
    }
    try {
        cmds.run(client, msg, args);
    }
    catch (e) {
    }
};

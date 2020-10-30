const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ['pong'],
    description: 'Show bots latency',
    cooldown: 5,

    /**
     * @param {import("../structures/Client")} client;
     * @param {import("discord.js").Message} msg;
     */
    run: async (client, msg) => {
        const m = await msg.channel.send('Pinging.....');
        const embed = new MessageEmbed()
            .setTitle('Pong!')
            .setDescription(`**Ping: ${Math.floor(m.createdTimestamp - msg.createdTimestamp)}**\n**Ws: ${client.ws.ping}**`)
            .setFooter(msg.author.username)
            .setTimestamp();
        m.edit('', embed);
    },
};

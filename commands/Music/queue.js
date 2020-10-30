const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'queue',
    aliases: ['q', 'list'],
    description: 'Show the songs queue',
    cooldown: 5,

    /**
     * @param {import("./Client")} client;
     * @param {import("discord.js").Message} msg;
     */
    run: async (client, msg, args) => {
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return msg.channel.send('You must joined in voice channel');
        if (!msg.guild.music.playing && msg.guild.music.songDispatcher === null) {
            return msg.channel.send('There is no song playing rightnow!');
        }
        if (msg.guild.music.playing && voiceChannel.id !== msg.guild.music.current.voiceChannel.id) {
            return msg.channel.send(`You must join in ${msg.guild.music.current.voiceChannel.name}`);
        }

        const queue = msg.guild.music.queue
            .map((x, y) => `**${y + 1}.** - ${x.title}`)
            .splice(0, 10)
            .join('\n');

        if (!queue.length) return msg.channel.send('Queue is empty, you better request a song');

        const embed = new MessageEmbed()
            .setDescription(queue);
        return msg.channel.send(embed);
    },
};

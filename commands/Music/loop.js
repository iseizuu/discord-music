/* eslint-disable no-unused-expressions */
module.exports = {
    name: 'loop',
    aliases: ['repeat'],
    description: 'Looping the current song',
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
        msg.guild.music.loop === false
            ? `${msg.channel.send(`Looping: ${msg.guild.music.current.title}`)} ${msg.guild.music.loop = true}`
            : `${msg.channel.send('Looping: Disable')} ${msg.guild.music.loop = false}`;
    },
};

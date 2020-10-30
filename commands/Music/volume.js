module.exports = {
    name: 'volume',
    aliases: ['v', 'vol'],
    description: 'Setting up the volume',
    cooldown: 5,

    /**
     * @param {import("./Client")} client;
     * @param {import("discord.js").Message} msg;
     */
    run: async (client, msg, args) => {
        const input = args[0];
        if (!input) return msg.channel.send('Empty query has provided!');
        if (!Number(input)) return msg.channel.send('Args must be number');
        if (input < 1 || input > 100) return msg.channel.send('You put invalid number, maxVolume = 100');
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return msg.channel.send('You must joined in voice channel');

        if (!msg.guild.music.playing && msg.guild.music.songDispatcher === null) {
            return msg.channel.send('There is no song playing rightnow!');
        }
        if (msg.guild.music.playing && voiceChannel.id !== msg.guild.music.current.voiceChannel.id) {
            return msg.channel.send(`You must join in ${msg.guild.music.current.voiceChannel.name}`);
        }
        const vol = input / 100;
        msg.guild.music.songDispatcher.setVolume(vol);
        return msg.channel.send(`Set volume to: ${input}%`);
    },
};

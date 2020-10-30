const ytdl = require('ytdl-core');
const ytb = require('scrape-youtube');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Play music',
    cooldown: 5,

    /**
     * @param {import("../structures/Client")} client;
     * @param {import("discord.js").Message} msg;
     */
    run: async (client, msg, args) => {
        const query = args.join(' ');
        if (!query) return msg.channel.send('Empty Query');

        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return msg.channel.send('You must joined in voice channel');

        if (msg.guild.music.playing && voiceChannel.id !== msg.guild.music.current.voiceChannel.id) {
            return msg.channel.send(`You must join in ${msg.guild.music.current.voiceChannel.name}`);
        }

        const search = await ytb.default.search(query);
        if (msg.guild.music.playing) {
            msg.guild.music.queue.push(songObj(search[0], voiceChannel));
            return msg.channel.send(`Added: ${search[0].title} To queue`);
        }
        else {
            msg.guild.music.queue.push(songObj(search[0], voiceChannel));
        }

        play(search[0].link, voiceChannel, msg);
    },
};

function songObj(video, voiceChannel) {
    const duration = require('../../structures/Utilities').parseDuration(video.duration);
    return {
        url: video.link,
        title: video.title,
        times: video.duration,
        duration,
        channel: video.channel,
        thumbnail: video.thumbnail,
        voiceChannel,
    };
}

/**
 * @param {*} url;
 * @param {import('discord.js').VoiceChannel} voiceChannel;
 * @param {import('discord.js').Message} msg;
 */
async function play(url, voiceChannel, msg) {
    try {
        const songs = await voiceChannel.join().then(x => x.play(
            ytdl(url, {
                quality: 'highestaudio',
                highWaterMark: 1024 * 1024 * 1024,
            }),
        ));
        songs.on('start', () => {
            msg.guild.music.songDispatcher = songs;
            msg.guild.music.playing = true;
            msg.guild.music.current = msg.guild.music.queue[0];
            msg.guild.music.queue.shift();
            const info = msg.guild.music.current;
            const embed = new MessageEmbed()
                .setURL(info.url)
                .setTitle('Now Playing')
                .setDescription(`**${info.title}** By: **${info.channel.name}**`)
                .setThumbnail(info.thumbnail);
            return msg.channel.send(embed);
        });
        songs.on('error', (er) => {
            voiceChannel.leave();
            msg.guild.music.songDispatcher = null;
            msg.guild.music.playing = false;
            msg.guild.music.queue.length = 0;
            return msg.channel.send(`Oh No, \`${er}\``);
        });
        songs.on('finish', () => {
            if (msg.guild.music.loop) {
                msg.guild.music.queue.unshift(msg.guild.music.current);
            }
            if (msg.guild.music.queue.length >= 1) {
                return play(msg.guild.music.queue[0].url, voiceChannel, msg);
            }
            msg.guild.music.songDispatcher = null;
            msg.guild.music.playing = false;
            voiceChannel.leave();
            msg.guild.music.queue.length = 0;
            return msg.channel.send('Leaving voice channel, because song has ended');
        });
    }
    catch (er) {
        return msg.channel.send(`Error, \`${er}\``);
    }
}

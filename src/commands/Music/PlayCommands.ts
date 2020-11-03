import type { Message } from "discord.js";
import type { VoiceChannel } from "discord.js";
import ytdl from "ytdl-core";
import Command from "../../structures/Command";
import { CommandConf } from "../../decorators";
import type VideoInfo from "../../structures/VideoInfo";

@CommandConf({
    name: "play",
    aliases: ["p"],
    description: "",
    usage: "play <song title>",
    ownerOnly: false
})
export default class PlayCommand extends Command {
    public async exec(msg: Message, args: string[]): Promise<Message | void> {
        const voiceChannel = msg.member?.voice.channel;
        const query = args.join(" ");

        if (!voiceChannel) return msg.channel.send("You need to join voice channel first");
        if (!query) return msg.channel.send("An empty query has provided, you should type the song title");

        const songs = await msg.guild?.music.search(query);
        if (!songs?.length) return msg.channel.send("Sorry, no results found");

        await this.play(songs[0], msg, voiceChannel);
    }

    private async play(video: VideoInfo, msg: Message,  voiceChannel: VoiceChannel): Promise<void> {
        const guildMusic = msg.guild?.music;
        const structure = {
            info: {
                id: video.id,
                title: video.title,
                author: video.author,
                duration: video.duration,
                url: video.url,
                thumbnail:`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
            },
            requester: msg.author
        };

        guildMusic?.queue.push(structure);

        const connect = await voiceChannel.join();
        connect.play(ytdl(video.url, {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1024 * 1024 * 1024
        }))
            .on("start", () => {
            // guildMusic?.dispatcher;
                guildMusic!.playing = true;
                guildMusic!.currSong = structure;
                guildMusic?.queue.shift();
                void msg.channel.send(`Playing: ${guildMusic!.currSong.info.title}`);
            })
            .on("finish", () => {
                guildMusic!.playing = false;
                guildMusic!.currSong = null;
                voiceChannel.leave();
                void msg.channel.send("Dah selesai");
            });
    }
    
}

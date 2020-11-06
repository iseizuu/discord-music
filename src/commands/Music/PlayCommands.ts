import type { Message, TextChannel } from "discord.js";
import Command from "../../structures/Command";
import { CommandConf } from "../../decorators";
import Playlist from "../../structures/Playlist";
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
        if (msg.guild?.music.current && voiceChannel.id !== msg.guild?.music.channel.voice?.id) {
            return msg.channel.send(`I'am already playing in **${
                msg.guild?.music.channel.voice!.name}** voice channel`);
        }

        const result = await msg.guild?.music.search(query);
        let songs: VideoInfo[];
        if (result instanceof Playlist) songs = result.videos;
        else songs = result!;

        if (!songs?.length) return msg.channel.send("Sorry, no results found");

        if (msg.guild?.music.current) {
            await msg.channel.send({
                embed: {
                    color: this.client.config.color,
                    description: `**[${songs[0].title}](${songs[0].url}) Added to queue**`
                }
            });
        }

        msg.guild?.music.add(songs[0], msg.author);
        if (!msg.guild?.music.channel.voice) {
            await msg.guild?.music.join(msg.member!.voice.channel!, msg.channel as TextChannel);
            await msg.member?.guild.me?.voice.setSelfDeaf(true);
        }
        if (!msg.guild?.music.dispatcher) msg.guild?.music.start();
    }
}

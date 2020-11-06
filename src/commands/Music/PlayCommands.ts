import type { Message, TextChannel } from "discord.js";
import Command from "../../structures/Command";
import { CommandConf } from "../../decorators";
import Playlist from "../../structures/Playlist";

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
        if (result instanceof Playlist) {
            const songs = result.videos;
            for (const song of songs) {
                msg.guild?.music.add(song);
            }
            await msg.channel.send({
                embed: {
                    color: this.client.config.color,
                    description: `**\`${songs.length}\`songs added to queue**`
                }
            });
        } else {
            const songs = result;
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
        }

        if (!msg.guild?.music.channel.voice) {
            await msg.guild?.music.join(msg.member!.voice.channel!, msg.channel as TextChannel);
            await msg.member?.guild.me?.voice.setSelfDeaf(true);
        }

        if (!msg.guild?.music.dispatcher) msg.guild?.music.start();
    }
}

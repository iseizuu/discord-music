import type { Message, TextChannel } from "discord.js";
import Command from "../../structures/Command";
import { CommandConf } from "../../decorators";

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

        msg.guild?.music.add(songs[0], msg.author);
        if (!msg.guild?.music.channel.voice) await msg.guild?.music.join(msg.member!.voice.channel!, msg.channel as TextChannel);
        if (!msg.guild?.music.dispatcher) msg.guild?.music.start();
    }
}

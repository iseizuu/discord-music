import type { Message } from "discord.js";
import Command from "../../structures/Command";
import { CommandConf } from "../../decorators";
import  lyrics from "@allvaa/get-lyrics";

@CommandConf({
    name: "lyric",
    aliases: ["lr", "ly"],
    description: "",
    usage: "",
    ownerOnly: false
})
export default class LyricCommand extends Command {
    public async exec(msg: Message, args: string[]): Promise<Message | void> {
        let query = args.join(" ");

        if (!query && !msg.guild?.music.current) return msg.channel.send("An invalid was provided, you should type the song title to get the lyrics");
        if (!query && msg.guild?.music.current) query = msg.guild?.music.current.info.title
            .replace(/([.+]|\(.+\))/gi, "");

        console.log(query);
        const search = await lyrics(query);
        console.log(search?.lyrics);
        if (!search?.lyrics.length) return msg.channel.send("No results found");

        if (search.lyrics.length < 2000) {
            return msg.channel.send({
                embed: {
                    title: search.title,
                    color: this.client.config.color,
                    description: search.lyrics,
                    thumbnail: {
                        url: search.image
                    }
                }
            });
        } else {
            return msg.channel.send("Sorry lyric is too loong");
        }
    }
}

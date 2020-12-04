import type { Message } from "discord.js";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";

@CommandConf({
    name: "nowplaying",
    aliases: ["nowplay", "np"]
})
export default class NowPlayingCommand extends Command {
    public async exec(msg: Message): Promise<void> {
        if (!msg.guild?.music.current) return;
        await msg.channel.send({
            embed: {
                color: this.client.config.color,
                description: `**Now Playing: [${
                    msg.guild?.music.current.info.title}](${
                    msg.guild?.music.current.info.url})\n\`${
                    this.client.util.progressBar(msg.guild.music.dispatcher!.streamTime, msg.guild.music.current.info.duration!)}\` [${
                    this.client.util.parseDur(msg.guild.music.dispatcher!.streamTime)}/${
                    this.client.util.parseDur(msg.guild.music.current.info.duration!)
                }]**`
            }
        });
    }
}

import type { Message } from "discord.js";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";

@CommandConf({
    name: "loop",
    aliases: ["repeat"]
})
export default class LoopCommand extends Command {
    public async exec(msg: Message): Promise<Message | void> {
        const voiceChannel = msg.member?.voice.channel;

        if (!msg.guild?.music.current) return;
        if (!voiceChannel) return msg.channel.send("You need to join voice channel first");
        if (msg.guild?.music.current && voiceChannel.id !== msg.guild?.music.channel.voice?.id) {
            return msg.channel.send(`I'am sorry, you need to be in **${
                msg.guild?.music.channel.voice!.name}** voice channel`);
        }

        msg.guild.music.loop = !msg.guild.music.loop;
        return msg.channel.send({
            embed: {
                color: this.client.config.color,
                description: `**Loop ${msg.guild.music.loop ? "enabled" : "disabled"}**`
            }
        });
    }
}

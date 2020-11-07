import type { Message } from "discord.js";
import Command from "../../structures/Command";
import { CommandConf } from "../../decorators";

@CommandConf({
    name: "skipall",
    aliases: ["clearqueue", "sall"],
    description: "Skip all queues",
    usage: "",
    ownerOnly: false
})
export default class SkipAllCommand extends Command {
    public async exec(msg: Message): Promise<Message | void> {
        const voiceChannel = msg.member?.voice.channel;
        
        if (!msg.guild?.music.current) return;
        if (!voiceChannel) return msg.channel.send("You need to join voice channel first");
        if (msg.guild?.music.current && voiceChannel.id !== msg.guild?.music.channel.voice?.id) {
            return msg.channel.send(`I'am sorry, you need to be in **${
                msg.guild?.music.channel.voice!.name}** voice channel`);
        }

        void msg.react("✅");
        msg.guild?.music.stop();
    }
}

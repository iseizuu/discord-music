import type { Message } from "discord.js";
import Command from "../../structures/Command";
import { CommandConf } from "../../decorators";

@CommandConf({
    name: "volume",
    aliases: ["vol", "v"],
    description: "Set volume to current song",
    usage: "volume <volume number>",
    ownerOnly: false
})
export default class VolumeCommand extends Command {
    public async exec(msg: Message, args: string[]): Promise<Message | void> {
        const voiceChannel = msg.member?.voice.channel;
        const numb = parseInt(args[0]);
        
        if (!msg.guild?.music.current) return;
        if (!voiceChannel) return msg.channel.send("You need to join voice channel first");
        if (msg.guild?.music.current && voiceChannel.id !== msg.guild?.music.channel.voice?.id) {
            return msg.channel.send(`I'am sorry, you need to be in **${
                msg.guild?.music.channel.voice!.name}** voice channel`);
        }

        if (!numb) return msg.channel.send(`Current volume is \`${msg.guild.music.volume}\``);
        if (!Number(numb)) return;
        if (numb < 1 || numb > 100) {
            return msg.channel.send("You provide an invalid volume number, volume must be 1 - 100");
        }

        msg.guild?.music.setVolume(numb);
        return msg.channel.send(`Set volume to : \`${numb}\``);
    }
}

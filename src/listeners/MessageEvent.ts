import type { Message } from "discord.js";
import Listener from "../structures/Listener";

export default class MessageEvent extends Listener {
    public name = "message";
    private readonly prefix = this.client.config.prefix;
    public exec(msg: Message): void {
        if (!msg.guild) return;
        if (msg.author.bot) return;
        if (!msg.content.startsWith(this.prefix)) return;

        const args = msg.content.slice(this.prefix.length).trim().split(/ +/g);
        const commandName = args.shift()!.toLowerCase();
        const command = this.client.commands.get(commandName.toLowerCase()) || this.client.commands.find(c => c.config.aliases!.includes(commandName.toLowerCase()));
        if (command) command.exec(msg, args);
    }
}

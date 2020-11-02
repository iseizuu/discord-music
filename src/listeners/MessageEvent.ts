/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { Message } from "discord.js";
import { Collection } from "discord.js";
import Listener from "../structures/Listener";

export default class MessageEvent extends Listener {
    public name = "message";
    private readonly prefix = this.client.config.prefix;
    public async exec(msg: Message): Promise<Message | void> {
        if (!msg.guild) return;
        if (msg.author.bot) return;
        if (!msg.content.startsWith(this.prefix)) return;

        const args = msg.content.slice(this.prefix.length).trim().split(/ +/g);
        const commandName = args.shift()!.toLowerCase();
        const command = this.client.commands.get(commandName.toLowerCase()) || this.client.commands.find(c => c.config.aliases!.includes(commandName.toLowerCase()));
        if (command) {
            if (command.config.ownerOnly && !msg.author.isDev) return;
            try {
                if (!this.client.cooldowns.has(command.config.name)) {
                    this.client.cooldowns.set(command.config.name, new Collection());
                }
                const now = Date.now();
                const timestamps = this.client.cooldowns.get(command.config.name);
                let cooldownAmount = (command.config.cooldown || 3) * 1000;
                if (this.client.config.owners.includes(msg.author.id)) cooldownAmount = 0 * 1000;
                if (timestamps.has(msg.author.id)) {
                    const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        return msg.channel.send(`Hold on, just wait ${timeLeft.toFixed(1)} To used \`${command.config.name}\` again.`);
                    }
                }
                timestamps.set(msg.author.id, now);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
                await command.exec(msg, args);
            } catch (e) {
                console.error(e);
            }
        }
    }
}

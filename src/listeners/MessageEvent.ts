import type { Message } from "discord.js";
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
                if (!msg.author.isDev) {
                    const now = Date.now();
                    const userCooldown = this.client.cooldowns.get(`${command.config.name}-${msg.author.id}`);
                    const cooldownAmount = command.config.cooldown! * 1000;
                    if (userCooldown) {
                        const expirationTime = userCooldown + cooldownAmount;
                        if (now < expirationTime) {
                            const timeLeft = (expirationTime - now) / 1000;
                            await msg.channel.send(`Hold on, you just need to wait for ${timeLeft.toFixed(1)} secs to use \`${command.config.name}\` again.`);
                            return;
                        }
                    }
                    this.client.cooldowns.set(`${command.config.name}-${msg.author.id}`, now);
                    setTimeout(() => this.client.cooldowns.delete(`${command.config.name}-${msg.author.id}`), cooldownAmount);
                }
                await command.exec(msg, args);
            } catch (e) {
                console.error(e);
            }
        }
    }
}

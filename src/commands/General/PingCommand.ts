import type { Message } from "discord.js";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";

@CommandConf({ 
    name: "ping",
    aliases: ["pang", "pung", "peng"],
    description: "Show bots latency",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class PingCommand extends Command {
    public async exec(msg: Message): Promise<void> {
        await msg.channel.send(`🏓 Pong! \`${this.client.ws.ping}ms\``);
    }
}

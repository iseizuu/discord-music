import type { Message } from "discord.js";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";

@CommandConf({ name: "ping" })
export default class PingCommand extends Command {
    public async exec(msg: Message): Promise<void> {
        await msg.channel.send(`🏓 Pong! \`${this.client.ws.ping}ms\``);
    }
}

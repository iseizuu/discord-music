import type { Client, Message } from "discord.js";
import Command from "../../structures/Command";

export default class PingCommand extends Command {
    public constructor(client: Client) {
        super(client, { name: "ping" });
    }

    public async exec(msg: Message): Promise<void> {
        await msg.channel.send(`🏓 Pong! \`${this.client.ws.ping}ms\``);
    }
}

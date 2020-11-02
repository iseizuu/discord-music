import type { Client, Message } from "discord.js";
import type { CommandConfig } from "../typings";

export default abstract class Command {
    public config: CommandConfig;
    public constructor(public readonly client: Client, config: CommandConfig) {
        this.config = {
            name: config.name,
            aliases: config.aliases?.length ? config.aliases : [],
            description: config.description || "Unspecified description.",
            cooldown: config.cooldown || 3
        };
    }

    public abstract exec(msg: Message, args?: string[]): any;
}

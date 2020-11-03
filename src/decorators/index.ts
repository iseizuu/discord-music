import type { Client } from "discord.js";
import type { CommandConfig } from "../typings";
import type Command from "../structures/Command";

export function CommandConf(config: CommandConfig) {
    return function<T extends Command>(target: new(...args: any[]) => T): new (client: Client) => T {
        config = {
            ...config,
            aliases: config.aliases?.length ? config.aliases : [],
            description: config.description || "Unspecified description.",
            usage: config.usage || "Usage not specified",
            cooldown: config.cooldown || 3,
            ownerOnly: Boolean(config.ownerOnly)
        };
        return new Proxy(target, {
            construct: (ctx, [client]): T => new ctx(client, config)
        });
    };
}

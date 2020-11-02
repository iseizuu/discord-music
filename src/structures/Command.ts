import type { Client, Message } from "discord.js";
import type { CommandConfig } from "../typings";

export default abstract class Command {
    public constructor(public readonly client: Client, public readonly config: CommandConfig) {}
    public abstract exec(msg: Message, args?: string[]): unknown;
}

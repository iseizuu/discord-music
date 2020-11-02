import type { Client } from "discord.js";

export default abstract class Listener {
    public abstract name: string;
    public constructor(public readonly client: Client) {} // eslint-disable-line
    public abstract exec(...args: unknown[]): any;
}

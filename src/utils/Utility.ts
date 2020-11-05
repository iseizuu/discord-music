import type { Client } from "discord.js";

export default class Utility {
    public constructor(public readonly client: Client) {}
    public durationToMillis(duration: string): number {
        return duration.split(/[:.]/).map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    }

    public parseDur(duration: number): number|string {
        const hours = Math.floor((duration / (1e3 * 60 * 60)) % 60),
            minutes = Math.floor(duration / 6e4),
            seconds = (duration % 6e4 / 1e3).toFixed(0);
        
        const output = `${hours ? `${hours.toString().padStart(2, "0")}:` : ""}${
            minutes.toString().padStart(2, "0")}:${
            seconds.toString().padStart(2, "0")}`;
        return output;
    }
}

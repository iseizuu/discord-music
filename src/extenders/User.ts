import { Structures } from "discord.js";

class MusicUser extends Structures.get("User") {
    public get isDev(): boolean {
        return this.client.config.owners.includes(this.id);
    }
}

Structures.extend("User", () => MusicUser);

declare module "discord.js" {
    export interface User {
        isDev: boolean;
    }
}

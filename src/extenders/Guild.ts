import { Structures } from "discord.js";
import MusicHandler from "../structures/MusicHandler";

class MusicGuild extends Structures.get("Guild") {
    public readonly music: MusicHandler = new MusicHandler(this);
}

declare module "discord.js" {
    export interface Guild {
        music: MusicHandler;
    }
}

Structures.extend("Guild", () => MusicGuild);

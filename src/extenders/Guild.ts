/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Structures } from "discord.js";
import type MusicClient from "../structures/Client";

interface music { 
    queue: never[]; 
    playing: boolean; 
    loop: boolean; 
    current: undefined; 
    songDispatcher: null; 
    volume: number; 
}
class MusicGuild extends Structures.get("Guild") {
    constructor(client: MusicClient, data: any) {
        super(client, data);
        this.music = {
            queue: [],
            playing: false,
            loop: false,
            current: undefined,
            songDispatcher: null,
            volume: 1
        };
    }
}

declare module "discord.js" {
    export interface Guild {
        music: music;

    }
}

Structures.extend("Guild", () => MusicGuild);

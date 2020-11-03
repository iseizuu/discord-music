import type { Client, Guild, StreamDispatcher } from "discord.js";
import type Song from "./Song";
import type VideoInfo from "./VideoInfo";

export default class MusicHandler {
    public readonly client: Client;
    public readonly queue: Song[] = []; 
    public playing = false;
    public loop = false;
    public currSong: Song | null = null;
    public prevSong: Song | null = null;
    public dispatcher: StreamDispatcher | null = null;
    public volume = 100;

    public constructor(public readonly guild: Guild) {
        this.client = guild.client;
    }

    public search(query: string): Promise<VideoInfo[]> {
        return this.client.youtube.load(query);
    }
}

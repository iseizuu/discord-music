import type { Client, Guild, StreamDispatcher, User, TextChannel, VoiceChannel } from "discord.js";
import type VideoInfo from "./VideoInfo";
import Song from "./Song";
import ytdl from "ytdl-core";

export default class MusicHandler {
    public queue: Song[] = []; 
    public loop = false;
    public current: Song | null = null;
    public previous: Song | null = null;
    public volume = 100;
    public channel: { text?: TextChannel; voice?: VoiceChannel} = {};

    public constructor(public readonly guild: Guild) {}

    public get client(): Client {
        return this.guild.client;
    }

    public add(video: VideoInfo, requester?: User): Song {
        const song = new Song(video, requester);
        this.queue.push(song);
        return song;
    }

    public start(): void {
        if (!this.channel.voice) return;
        this.guild.voice?.connection?.play(ytdl(this.queue[0].info.url, {
            filter: "audioonly",
            quality: "highestaudio"
        }));
        this.listen();
    }

    public async join(voice: VoiceChannel, text?: TextChannel): Promise<boolean> {
        if (!voice.joinable) return false;
        await voice.join();
        this.channel = { voice, text };
        return true;
    }

    public reset(): void {
        this.channel = {};
        this.loop = false;
        this.queue = [];
        this.current = null;
        this.previous = null;
        this.volume = 100;
    }

    public search(query: string): Promise<VideoInfo[]> {
        return this.client.youtube.load(query);
    }

    public get dispatcher(): StreamDispatcher|undefined {
        return this.guild.me?.voice.connection?.dispatcher;
    }

    private listen(): void {
        this.dispatcher
            ?.on("start", () => {
                this.current = this.queue.shift()!;
            })
            .on("finish", () => {
                this.previous = this.current;
                this.current = null;
                if (this.loop) this.queue.push(this.previous!);
                if (!this.queue.length) {
                    this.channel.voice?.leave();
                    this.reset();
                    return;
                }
                this.start();
            });
    }
}

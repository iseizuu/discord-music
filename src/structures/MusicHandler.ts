import type { Client, Guild, StreamDispatcher, User, TextChannel, VoiceChannel } from "discord.js";
import type VideoInfo from "./VideoInfo";
import Song from "./Song";
import ytdl from "ytdl-core";
import type Playlist from "./Playlist";

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

    public setVolume(newVol: number): void {
        this.volume = newVol;
        this.dispatcher?.setVolume(newVol / 100);
    }

    public togglePause(): void {
        this.dispatcher?.paused ? this.dispatcher.resume() : this.dispatcher?.pause();
    }

    public skip(): void {
        this.dispatcher?.end();
    }

    public stop(): void {
        this.queue = [];
        this.loop = false;
        this.skip();
    }

    public reset(): void {
        this.channel = {};
        this.loop = false;
        this.queue = [];
        this.current = null;
        this.previous = null;
        this.volume = 100;
    }

    public search(query: string): Promise<Playlist|VideoInfo[]> {
        return this.client.youtube.load(query);
    }

    public get dispatcher(): StreamDispatcher|null {
        return this.guild.me?.voice.connection?.dispatcher || null;
    }

    private listen(): void {
        this.dispatcher
            ?.on("start", () => {
                this.current = this.queue.shift()!;
                void this.channel.text?.send({
                    embed: {
                        color: this.client.config.color,
                        description: `**Now Playing: [${this.current.info.title}](${this.current.info.url}) [${
                            this.client.util.parseDur(this.current.info.duration!)
                        }]**`
                    }
                });
            })
            .on("finish", () => {
                this.previous = this.current;
                this.current = null;
                if (this.loop) this.queue.push(this.previous!);
                if (!this.queue.length) {
                    this.channel.voice?.leave();
                    void this.channel.text?.send({
                        embed: {
                            color: this.client.config.color,
                            description: "**Music queue ended**"
                        }
                    });
                    this.reset();
                    return;
                }
                this.start();
            })
            .on("error", (rusak) => {
                this.previous = null;
                this.current = null;
                this.channel.voice?.leave();
                void this.channel.text?.send({
                    embed: {
                        color: "RED",
                        description: `**Oh no, \`${rusak.message}\`**`
                    }
                });
                this.reset();
            });
    }
}

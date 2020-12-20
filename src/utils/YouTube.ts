import type { Client } from "discord.js";
import Playlist from "../structures/Playlist";
import VideoInfo from "../structures/VideoInfo";
import ytdl from "ytdl-core";

export default class YouTube {
    private readonly initialDataRegex = /(window\["ytInitialData"]|var ytInitialData)\s*=\s*(.*);<\/script>/;
    private readonly playlistURLRegex = /^https?:\/\/(?:www\.|)youtube\.com\/playlist\?list=(.*)$/;
    private readonly videoURLRegex = /^https?:\/\/((?:www\.|)youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(\S+)$/;
    public constructor(public readonly client: Client) {}

    public async load(query: string): Promise<Playlist|VideoInfo[]> {
        if (this.playlistURLRegex.test(query)) return this.loadPlaylist(query);
        else if (this.videoURLRegex.test(query)) return this.loadVideo(query);
        else return this.search(query);
    }

    public async search(query: string): Promise<VideoInfo[]> {
        const { text } = await this.client.httpClient
            .get("https://www.youtube.com/results")
            .query("search_query", query);
        return this.extractSearchResults(text);
    }

    public async loadPlaylist(url: string): Promise<Playlist> {
        const { text } = await this.client.httpClient
            .get(url);
        return this.extractPlaylist(text);
    }

    public async loadVideo(url: string): Promise<VideoInfo[]> {
        const { videoDetails: { title, videoId, author: { name: authorName }, lengthSeconds } } = await ytdl.getBasicInfo(url);
        const durationMs = parseInt(lengthSeconds) * 1000;
        return [new VideoInfo(videoId, title, authorName, durationMs)];
    }

    private extractSearchResults(html: string): VideoInfo[] {
        const matched = this.initialDataRegex.exec(html)![2];
        const result = JSON.parse(matched);
        const videos = result
            .contents
            .twoColumnSearchResultsRenderer
            .primaryContents
            .sectionListRenderer
            .contents[0]
            .itemSectionRenderer
            .contents;
        return videos
            .filter((x: any) => Boolean(x.videoRenderer))
            .map((x: any) => this.extractData(x.videoRenderer)) as VideoInfo[];
    }

    private extractPlaylist(html: string): Playlist {
        const matched = this.initialDataRegex.exec(html)![2];
        const result = JSON.parse(matched);
        const playlistInfo = result.sidebar.playlistSidebarRenderer.items[0].playlistSidebarPrimaryInfoRenderer;
        const playlistOwner = result.sidebar.playlistSidebarRenderer.items[1].playlistSidebarSecondaryInfoRenderer.videoOwner.videoOwnerRenderer;
        const videos = result
            .contents
            .twoColumnBrowseResultsRenderer
            .tabs[0]
            .tabRenderer
            .content
            .sectionListRenderer
            .contents[0]
            .itemSectionRenderer
            .contents[0]
            .playlistVideoListRenderer
            .contents;
        const extractedVideos: VideoInfo[] = videos
            .filter((x: any) => x.playlistVideoRenderer?.isPlayable as boolean)
            .map((x: any) => this.extractData(x.playlistVideoRenderer));
        return new Playlist(
            playlistInfo.navigationEndpoint.watchEndpoint.playlistId,
            playlistInfo.title.runs[0].text,
            playlistOwner.title.runs[0].text,
            extractedVideos);
    }

    private extractData(video: any): VideoInfo {
        const title = video.title.runs[0].text;
        const author = video.shortBylineText?.runs[0].text;
        const duration = video.lengthText ? this.client.util.durationToMillis(video.lengthText.simpleText) : null;
        return new VideoInfo(video.videoId, title, author, duration);
    }
}

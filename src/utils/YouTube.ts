import type { Client } from "discord.js";
import Playlist from "../structures/Playlist";
import VideoInfo from "../structures/VideoInfo";

export default class YouTube {
    private readonly initialDataRegex = /(window\["ytInitialData"]|var ytInitialData)\s*=\s*(.*);/;
    private readonly playlistURLRegex = /^https?:\/\/(?:www.|)youtube.com\/playlist\?list=(.*)$/;
    public constructor(public readonly client: Client) {}

    public async load(query: string): Promise<Playlist|VideoInfo[]> {
        if (this.playlistURLRegex.test(query)) return this.loadPlaylist(query);
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
        const playlistName = result
            .metadata
            .playlistMetadataRenderer
            .title;
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
        return new Playlist(playlistName, extractedVideos);
    }

    private extractData(video: any): VideoInfo {
        const title = video.title.runs[0].text;
        const author = video.shortBylineText?.runs[0].text;
        const duration = video.lengthText ? this.client.util.durationToMillis(video.lengthText.simpleText) : null;
        return new VideoInfo(video.videoId, title, author, duration);
    }
}

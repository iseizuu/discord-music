import type { Client } from "discord.js";
import VideoInfo from "../structures/VideoInfo";
import Util from "./Util";

export default class YouTubeSearch {
    private readonly initialDataRegex = /(window\["ytInitialData"]|var ytInitialData)\s*=\s*(.*);/;
    public constructor(public readonly client: Client) {}

    public async load(query: string): Promise<VideoInfo[]> {
        const { text } = await this.client.httpClient
            .get("https://www.youtube.com/results")
            .query("search_query", query);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.extractVideo(text);
    }

    private extractVideo(html: string): VideoInfo[] {
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const matched = html.match(this.initialDataRegex)![2];
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

    private extractData(video: any): VideoInfo|undefined {
        const title = video.title.runs[0].text;
        const author = video.ownerText.runs[0].text;
        const duration = video.lengthText ? Util.durationToMillis(video.lengthText.simpleText) : null;
        return new VideoInfo(video.videoId, title, author, duration, `https://www.youtube.com/watch?v=${video?.videoId}`);
    }
}
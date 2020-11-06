import type VideoInfo from "./VideoInfo";

export default class Playlist {
    public constructor(public readonly name: string, public readonly videos: VideoInfo[]) {}
}

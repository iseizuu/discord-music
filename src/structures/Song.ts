import type { User } from "discord.js";
import type VideoInfo from "./VideoInfo";

export default class Song {
    public constructor(
        public readonly info: VideoInfo,
        public readonly requester?: User
    ) {}
}

export default class VideoInfo {
    public readonly url: string;
    public readonly thumbnail: string;
    public constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly author: string,
        public readonly duration: number|null
    ) {
        this.url = `https://www.youtube.com/watch?v=${this.id}`;
        this.thumbnail = `https://i.ytimg.com/vi/${this.id}/hqdefault.jpg`;
    }
}

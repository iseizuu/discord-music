export default class VideoInfo {
    public constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly author: string,
        public readonly duration: number|null,
        public readonly url: string) {}
}

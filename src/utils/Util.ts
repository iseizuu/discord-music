export default class Util {
    public static durationToMillis(duration: string): number {
        return duration.split(/[:.]/).map(Number).reduce((acc, curr) => acc * 60 + curr, 0) * 1000;
    }
}

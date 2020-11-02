export default class Util {
    public static durationToMillis(duration: string): number {
        return duration.split(/[:.]/).map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    }
}

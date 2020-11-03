export default class Util {
    public static durationToMillis(duration: string): number {
        return duration.split(/[:.]/).map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    }

    public static parseDur(duration: string): string {
        const hours = Math.floor((Number(duration) / (1e3 * 60 * 60)) % 60),
            minutes = Math.floor(Number(duration) / 6e4),
            seconds = ((Number(duration) % 6e4) / 1e3).toFixed(0);
        
        const output = `${hours ? `${hours.toString().padStart(2, "0")}:` : ""}${
            minutes.toString().padStart(2, "0")}:${
            seconds.toString().padStart(2, "0")}`;
        return output;
    }
}

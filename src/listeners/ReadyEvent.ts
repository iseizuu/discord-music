import Listener from "../structures/Listener";

export default class ReadyEvent extends Listener {
    public name = "ready";
    public exec(): void {
        console.log(`Logged in as ${this.client.user!.tag}`);
    }
}

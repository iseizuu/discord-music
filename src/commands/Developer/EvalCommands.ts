import type { Message } from "discord.js";
import Command from "../../structures/Command";
import { inspect } from "util";
import { CommandConf } from "../../decorators";

const depthFlagRegex = /^--depth=?(.*)$/;

@CommandConf({
    name: "eval",
    aliases: ["e"],
    usage: "eval codes",
    ownerOnly: true
})
export default class EvalCommand extends Command {
    public async exec(msg: Message, args: string[]): Promise<void> {
        const isAsync = args.includes("--async");
        const isSilent = args.includes("--silent");
        const isCustomDepth = args.some(e => depthFlagRegex.test(e));
        const depth = isCustomDepth ? parseInt(depthFlagRegex.exec(args.find(e => depthFlagRegex.exec(e))!)![1], 10) || 0 : 0;
        const code = args.filter(e => !/^--(async|silent|depth=?(.*))$/.test(e)).join(" ");
        const startTime = msg.createdTimestamp;

        const client = this.client; // eslint-disable-line
        const message = msg; // eslint-disable-line

        try {
            // eslint-disable-next-line no-eval
            let result = eval(isAsync ? `(async()=>{${code}})()` : code);
            let isResultPromise = false;
            if (result instanceof Promise) {
                result = await result;
                isResultPromise = true;
            }
            if (isSilent) return;
            let inspectedResult = typeof result === "string" ? result : inspect(result, { depth });
            if (isResultPromise) {
                inspectedResult = `Promise<${typeof result === "string" ? inspect(inspectedResult) : inspectedResult}>`;
            }
            await msg.channel.send(`${this.isURL(inspectedResult) ? inspectedResult : `\`\`\`js\n${inspectedResult}\`\`\``}\n**\`⏱️ ${Date.now() - startTime}ms\`**`);
        } catch (e) {
            await msg.channel.send(`${`\`\`\`js\n${e}\`\`\``}\n**\`⏱️ ${Date.now() - startTime}ms\`**`);
        }
    }

    private isURL(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}

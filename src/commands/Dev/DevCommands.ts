/* eslint-disable @typescript-eslint/prefer-regexp-exec */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import type { Client, Message } from "discord.js";
import Command from "../../structures/Command";
import { inspect } from "util";

export default class PingCommand extends Command {
    public constructor(client: Client) {
        super(client, { name: "eval" });
    }

    public async exec(msg: Message, _args: string[]): Promise<void> {
        if (!this.client.config.owners.includes(msg.author.id)) return;
        const isAsync = _args.includes("--async");
        const isSilent = _args.includes("--silent");
        const code = _args.filter((e: string) => !e.match(/^--(async|silent)$/)).join(" ");
        const startTime = msg.createdTimestamp;
        try {
            // eslint-disable-next-line no-eval
            let result = eval(isAsync ? `(async()=>{${code}})()` : code);
            let isResultPromise = false;
            if (result instanceof Promise) {
                result = await result;
                isResultPromise = true;
            }
            if (isSilent) return;
            let inspectedResult = typeof result === "string" ? result : inspect(result, { depth: 0 });
            if (isResultPromise) {
                inspectedResult = `Promise<${typeof result === "string" ? inspect(inspectedResult) : inspectedResult}>`;
            }
            msg.channel.send(`${isURL(inspectedResult) ? inspectedResult : `\`\`\`js\n${inspectedResult}\`\`\``}\n**\`⏱️ ${Date.now() - startTime}ms\`**`);
        } catch (e) {
            msg.channel.send(`${`\`\`\`js\n${e}\`\`\``}\n**\`⏱️ ${Date.now() - startTime}ms\`**`);
        }
    }
}

function isURL(url: string) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

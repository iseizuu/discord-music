/* eslint-disable no-new */
const { inspect } = require('util');

module.exports = {
    name: 'eval',
    aliases: ['e'],
    description: 'gtw',
    cooldown: 0,

    /**
     * @param {import("../structures/Client")} client;
     * @param {import("discord.js").Message} msg;
     */
    run: async (client, msg, args) => {
        if (!client.config.owners.includes(msg.author.id)) return;
        const isAsync = args.includes('--async');
        const isSilent = args.includes('--silent');
        const code = args.filter(e => !e.match(/^--(async|silent)$/)).join(' ');
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
            let inspectedResult = typeof result === 'string' ? result : inspect(result, { depth: 0 });
            if (isResultPromise) {
                inspectedResult = `Promise<${typeof result === 'string' ? inspect(inspectedResult) : inspectedResult}>`;
            }
            msg.channel.send(`${isURL(inspectedResult) ? inspectedResult : `\`\`\`js\n${inspectedResult}\`\`\``}\n**\`⏱️ ${Date.now() - startTime}ms\`**`);
        }
        catch (e) {
            msg.channel.send(`${`\`\`\`js\n${e}\`\`\``}\n**\`⏱️ ${Date.now() - startTime}ms\`**`);
        }
    },
};

function isURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}

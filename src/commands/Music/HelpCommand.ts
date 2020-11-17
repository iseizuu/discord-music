import type { Message } from "discord.js";
import type { MessageEmbedOptions } from "discord.js";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";

@CommandConf({ 
    name: "help",
    aliases: ["commands", "?"],
    description: "",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class PingCommand extends Command {
    public async exec(msg: Message, args: string[]): Promise<void> {
        const embed: MessageEmbedOptions = {
            color: this.client.config.color,
            fields: []
        };

        const command = this.client.commands.get(args[0]);

        if (command) {
            Object.assign(embed, {
                author: {
                    name: `${command.config.name} command`,
                    iconURL: this.client.user?.displayAvatarURL()
                },
                description: command.config.description
            });

            embed.fields?.push({
                name: "Aliases",
                value: command.config.aliases?.join(", ")
            },
            {
                name: "Cooldown",
                value: command.config.cooldown
            });
        } else {
            embed.author = {
                name: "Command List",
                iconURL: this.client.user?.displayAvatarURL()
            };

            const categories = [...new Set(this.client.commands.map(x => x.config.category))];
            for (const category of categories) {
                const commands = this.client.commands.filter(x => x.config.category === category);
                embed.fields?.push({
                    name: category,
                    value: commands.map(x => `\`${x.config.name}\``).join(", ")
                });
            }
        }

        await msg.channel.send({ embed });
    }
}

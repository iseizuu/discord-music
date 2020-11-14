import type { Message } from "discord.js";
import Command from "../../structures/Command";
import { CommandConf } from "../../decorators";
import type { MessageReaction, User } from "discord.js";
import type Song from "../../structures/Song";

@CommandConf({
    name: "queue",
    aliases: ["q"],
    description: "Show all songs queue",
    usage: "",
    ownerOnly: false
})
export default class QueueCommand extends Command {
    private readonly emojis = ["◀", "⛔", "▶"];
    public async exec(msg: Message): Promise<Message | void> {
        const guildMusic = msg.guild?.music;
        if (!msg.guild?.music.current) return;

        const queue = guildMusic?.queue
            .map((x: Song, y: number) => `**${y + 1}. [${x.info.title}](${x.info.url}) [${
                this.client.util.parseDur(x.info.duration!)
            }]**`);

        const chunked = this.client.util.chunk(queue!, 10);
        const queueMessage = await msg.channel.send({
            embed: {
                author: {
                    name: msg.guild.name,
                    // eslint-disable-next-line camelcase
                    icon_url: msg.guild.iconURL({ dynamic: true })!
                },
                color: this.client.config.color,
                description: chunked[0].join("\n"),
                footer: {
                    text: `Page: 1/${chunked.length}`
                }
            }
        });

        if (queue!.length > 10) {
            for (const emoji of this.emojis) {
                await queueMessage.react(emoji);
            }
            this.awaitReactions(queueMessage, msg.author, chunked);
        }
    }

    private awaitReactions(msg: Message, author: User, chunked: string[][], page = 0): void {
        const filter = (reaction: MessageReaction, user: User): boolean => {
            return this.emojis.includes(reaction.emoji.name) && user.id === author.id;
        };

        const collector = msg.createReactionCollector(filter, {
            max: 1,
            time: 30000
        });

        collector
            .on("collect", (reaction: MessageReaction) => {
                void reaction.users.remove(author);
                const collect = reaction.emoji.name;
                if (collect === this.emojis[0]) page--;
                if (collect === this.emojis[1]) return collector.stop();
                if (collect === this.emojis[2]) page++;
                page = ((page % chunked.length) + chunked.length) % chunked.length;
                void msg.edit({
                    embed: {
                        author: {
                            name: msg.guild!.name,
                            // eslint-disable-next-line camelcase
                            icon_url: msg.guild!.iconURL({ dynamic: true })!
                        },
                        color: this.client.config.color,
                        description: chunked[page].join("\n"),
                        footer: {
                            text: `Page: ${page + 1}/${chunked.length}`
                        }
                    }
                });
                void this.awaitReactions(msg, author, chunked, page);
            })
            .on("end", (_, reason) => {
                if (["time", "user"].includes(reason)) void msg.reactions.removeAll();
            });
    }
}

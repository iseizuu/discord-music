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
    public async exec(msg: Message): Promise<Message | void> {
        const voiceChannel = msg.member?.voice.channel;
        const guildMusic = msg.guild?.music;

        if (!msg.guild?.music.current) return;
        if (!voiceChannel) return msg.channel.send("You need to join voice channel first");
        if (msg.guild?.music.current && voiceChannel.id !== msg.guild?.music.channel.voice?.id) {
            return msg.channel.send(`I'am sorry, you need to be in **${
                msg.guild?.music.channel.voice!.name}** voice channel`);
        }

        const queue = guildMusic?.queue
            .map((x: Song, y: number) => `**${y + 1} \`${x.info.title} [${
                this.client.util.parseDur(x.info.duration!)
            }]\`**`);

        const list = this.arrHandler(queue!, 10);
        const emoji = ["◀", "▶"];
        let page = 0;
        const messages = await msg.channel.send({
            embed: {
                color: this.client.config.color,
                description: list[page].join("\n"),
                footer: {
                    text: `Page: ${page + 1}/${list.length}`
                }
            }
        });

        if (queue!.length < 10) return;
        for (const length of emoji) {
            await messages.react(length);
        }
        const filter = (reaction: MessageReaction, user: User): boolean => {
            return reaction.emoji.name === emoji[0] 
                || reaction.emoji.name === emoji[1] 
                && user.id === msg.author.id;
        };
        const react = messages.createReactionCollector(filter, {
        });

        react.on("collect", (msgg: MessageReaction) => {
            const collect = msgg.emoji.name;
            if (collect === emoji[0]) {
                page--;
                void messages.reactions.resolve(emoji[0])!.users.remove(msg.author);
            }
            if (collect === emoji[1]) {
                page++;
                void messages.reactions.resolve(emoji[1])!.users.remove(msg.author);
            }
            page = ((page % list.length) + list.length) % list.length;
            void messages.edit({
                embed: {
                    color: this.client.config.color,
                    description: list[page].join("\n"),
                    footer: {
                        text: `Page: ${page + 1}/${list.length}`
                    }
                }
            });
        });
    }

    public arrHandler(array: string[], amount: number): any[] {
        const arr = [];
        for (let i = 0; i < array.length; i += amount) {
            arr.push(array.slice(i, i + amount));
        }
        return arr;
    }
}

/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { MessageOptions, MessageAdditions, StringResolvable } from "discord.js";
import { APIMessage, Structures } from "discord.js";

class Message extends Structures.get("Message") {
    public async inlineReply(content: StringResolvable | APIMessage, options?: MessageOptions | MessageAdditions): Promise<Message | Message[]> {
        const mentionRepliedUser = typeof (options || content)?.allowedMentions?.repliedUser === "undefined" ? true : (options || content)?.allowedMentions?.repliedUser;
        delete (options || content)?.allowedMentions?.repliedUser;

        const apiMessage = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options!).resolveData();
        Object.assign(apiMessage.data, { message_reference: { message_id: this.id } });
    
        // @ts-expect-error 2339
        if (!apiMessage.data.allowed_mentions || Object.keys(apiMessage.data.allowed_mentions).length === 0)
            // @ts-expect-error 2339
            apiMessage.data.allowed_mentions = { parse: ["users", "roles", "everyone"] };
        // @ts-expect-error 2339
        if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined")
            // @ts-expect-error 2339
            Object.assign(apiMessage.data.allowed_mentions, { replied_user: mentionRepliedUser });

        // @ts-expect-error 2339
        if (Array.isArray(apiMessage.data.content)) {
            return Promise.all(apiMessage.split().map(x => this.inlineReply(x)) as unknown as Message[]);
        }

        const { data, files } = await apiMessage.resolveFiles();
        // @ts-expect-error 2341
        return this.client.api.channels[this.channel.id].messages
            .post({ data, files })
            // @ts-expect-error 2341
            .then(d => this.client.actions.MessageCreate.handle(d).message);
    }
}

declare module "discord.js" {
    export interface MessageMentionOptions {
        repliedUser: boolean;
    }
    export interface Message {
        inlineReply(content: StringResolvable | APIMessage, options?: MessageOptions | MessageAdditions): Promise<Message | Message[]>;
    }
}

Structures.extend("Message", () => Message);

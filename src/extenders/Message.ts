/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { MessageOptions, MessageAdditions, StringResolvable } from "discord.js";
import { APIMessage, Structures } from "discord.js";

class Message extends Structures.get("Message") {
    public async inlineReply(content: StringResolvable | APIMessage, options?: MessageOptions | MessageAdditions): Promise<Message | Message[]> {
        // @ts-expect-error 2339
        const mention = typeof options?.mention === "undefined" ? true : options.mention;
        let apiMessage;

        if (content instanceof APIMessage) {
            apiMessage = content.resolveData();
        } else {
            apiMessage = APIMessage.create(this.channel, content, options!).resolveData();
            // @ts-expect-error 2339
            if (Array.isArray(apiMessage.data.content)) {
                return Promise.all(apiMessage.split().map(this.inlineReply.bind(this) as any) as unknown as Message[]);
            }
        }

        const { data, files } = await apiMessage.resolveFiles();
        // @ts-expect-error 2341
        return this.client.api.channels[this.channel.id].messages
            .post({ data: { ...data, message_reference: { message_id: this.id }, allowed_mentions: { replied_user: mention } }, files }) // eslint-disable-line camelcase
            // @ts-expect-error 2341
            .then(d => this.client.actions.MessageCreate.handle(d).message) as Message;
    }
}

declare module "discord.js" {
    export interface Message {
        inlineReply(content: StringResolvable | APIMessage, options?: MessageOptions | MessageAdditions | { mention: boolean }): Promise<Message | Message[]>;
    }
}

Structures.extend("Message", () => Message);

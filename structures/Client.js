const { Client, Collection } = require('discord.js');
const fs = require('util').promisify(require('fs').readdir);
const config = require('../config.json');

module.exports = class BotClient extends Client {
    constructor(opt) {
        super({
            owner: config.owners,
            fetchAllMembers: false,
            disableMentions: 'everyone',
            disabledEvents: ['TYPING_START', 'USER_NOTE_UPDATE'],
        }, opt);

        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.config = config;
        this.util = require('./Utilities');
    }

    async eventInit() {
        const Event = await fs('./events');
        for (const file of Event) {
            const eventName = file.split('.')[0];
            const event = require(`../events/${file}`);
            this.on(eventName, event.bind(null, this));
        }
    }

    get owners() {
        if (!this.options.owner) return null;
        if (typeof this.options.owner === 'string') return [this.users.cache.get(this.options.owner)];
        const owners = [];
        for (const owner of this.options.owner) owners.push(this.users.cache.get(owner));
        return owners;
    }
};

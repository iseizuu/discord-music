const { Structures } = require('discord.js');

module.exports = Structures.extend('Guild', Guild => {
    class GuildsOptions extends Guild {
        constructor(client, data) {
            super(client, data);
            this.music = {
                queue: [],
                playing: false,
                loop: false,
                current: undefined,
                songDispatcher: null,
                volume: 1,
            };
        }
    }
    return GuildsOptions;
});

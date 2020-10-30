/**
 * @param {import("../structures/Client")} client;
 */

module.exports = async (client) => {
    if (client.options.owner) {
        if (client.options.owner instanceof Array || client.options.owner instanceof Set) {
            for (const owner of client.options.owner) {
                client.users.fetch(owner).catch(err => {
                    this.emit('warn', `Unable to fetch owner ${owner}.`);
                    this.emit('error', err);
                });
            }
        }
        else {
            this.users.fetch(client.options.owner).catch(err => {
                this.emit('warn', `Unable to fetch owner ${client.options.owner}.`);
                this.emit('error', err);
            });
        }
    }
    console.log(`${client.user.tag} Is Ready`);
};

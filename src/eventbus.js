const eventBus = {
    events: {},

    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },

    unsubscribe(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(
                (subscriber) => subscriber !== callback
            );
        }
    },

    publish(event, data) {
        if (this.events[event]) {
            this.events[event].forEach((subscriber) => subscriber(data));
        }
    },
};

module.exports = eventBus;
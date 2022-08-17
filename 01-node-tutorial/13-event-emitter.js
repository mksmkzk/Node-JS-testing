const EventEmitter = require('events');

const customEmitter = new EventEmitter();

customEmitter.on('response', (name, id) => {
    console.log(`response received from ${name} with id ${id}`);
});

customEmitter.on('response', () => {
    console.log('Other response received');
    }
);




customEmitter.emit('response', 'john', 1);
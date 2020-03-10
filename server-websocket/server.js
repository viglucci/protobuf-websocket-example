const { asValue } = require('awilix');
const consoleDecorator = require('console-stamp');
const throng = require('throng');
const WebSocket = require('ws');
const createContainer = require('./start/create-container');
const bindRoutes = require('./start/bind-routes');

consoleDecorator(console, {
    label: true,
    pattern: 'HH:MM:ss.l',
    metadata: `[${process.pid}]`
});

const port = process.env.SERVER_WEBSOCKET_PORT;

throng({
    workers: 1,
    master: () => {
        console.log('Starting master process');
    },
    start: async (id) => {
        console.log(`Child process #${id} started`);
        const container = createContainer();

        const server = new WebSocket.Server({ port });
        container.register('webSocketServer', asValue(server));

        bindRoutes(container);

        container.resolve("connectionManager").startHeartbeat();
    }
});

const consoleDecorator = require('console-stamp');
const throng = require('throng');

consoleDecorator(console, {
    label: true,
    pattern: 'HH:MM:ss.l',
    metadata: `[${process.pid}]`
});

const port = process.env.SERVER_HTTP_PORT;

throng({
    workers: 1,
    master: () => {
        console.log('Starting master process');
    },
    start: async (id) => {
        const getApp = require('./app/app');
        const app = await getApp();
        app.listen(port, () => {
            return console.log(`Child process #${id} listening on HTTP port ${port}`)
        });
    }
});

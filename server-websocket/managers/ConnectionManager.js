const { Packet } = require("../generated/protobuf/Messages_pb");

class ConnectionManager {

    constructor({
        webSocketServer,
        messageHandler
    }) {
        this._connections = [];
        this.webSocketServer = webSocketServer;
        this.webSocketServer.on('connection', this.handleConnection.bind(this));
        this.messageHandler = messageHandler;
    }

    handleConnection(sock) {
        console.log("new connection");
        sock.isAlive = true;
        sock.on('message', (message) => {
            this.messageHandler.handleMessage(sock, message);
        });
        this.sendInitialPing(sock);
    }

    sendInitialPing(sock) {
        const packet = new Packet();
        packet.setId('ping');
        const bytes = packet.serializeBinary();
        sock.send(bytes);
    }

    startHeartBeat() {
        const interval = setInterval(() => {
            this.webSocketServer.clients.forEach(function each(sock) {
                if (sock.isAlive === false) {
                    return sock.terminate();
                }

                sock.isAlive = false;
                const packet = new Packet();
                packet.setId("ping");
                sock.send(packet.serializeBinary());
            });
        }, 30000);

        this.webSocketServer.on('close', function close() {
            clearInterval(interval);
        });
    }
}

module.exports = ConnectionManager;


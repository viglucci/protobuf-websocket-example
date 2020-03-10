const { Packet } = require("../generated/protobuf/Messages_pb");

class MessageHandler {
    constructor() {
        this.handlers = new Map();
    }

    registerHandler(id, handler) {
        this.handlers.set(id, handler);
    }

    handleMessage(sock, message) {
        const packet = Packet.deserializeBinary(message);
        const packetId = packet.getId();
        const handler = this.handlers.get(packetId);
        if (!handler) {
            console.log(`No handler registered for packet with id "${packetId}"`);
            return;
        }
        handler(sock, packet.getPayload());
    }
}

module.exports = MessageHandler;

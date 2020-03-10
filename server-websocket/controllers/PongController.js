class PongController {
    constructor() {
    }

    onPong(sock, packet) {
        console.log(`[onPong] Received message with id "${packet.getId()}"`);
        sock.isAlive = true;
    }
}

module.exports = PongController;

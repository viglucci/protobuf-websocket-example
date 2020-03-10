class PongController {
    constructor() {
    }

    onPong(sock) {
        console.log(`[onPong] Received message with id "ping"`);
        sock.isAlive = true;
    }
}

module.exports = PongController;

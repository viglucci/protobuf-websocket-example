module.exports = (container) => {
    const messageHandler = container.resolve("messageHandler");
    const PongController = container.resolve("PongController");
    const HelloController = container.resolve("HelloController");

    messageHandler.registerHandler("pong", PongController.onPong.bind(PongController));
    messageHandler.registerHandler("HelloRequest", HelloController.onHello.bind(HelloController));
};

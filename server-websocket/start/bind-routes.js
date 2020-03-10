module.exports = (container) => {
    const messageHandler = container.resolve("messageHandler");
    const PongController = container.resolve("PongController");

    messageHandler.registerHandler("pong", PongController.onPong.bind(PongController));
};

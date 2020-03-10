import { Packet, HelloRequest, HelloResponse } from "../../generated/protobuf/Messages_pb";

const socket = new WebSocket(`ws://localhost:${process.env.SERVER_WEBSOCKET_PUBLIC_PORT}`);

let pingTimeout = null;
function heartbeat() {
    clearTimeout(pingTimeout);

    pingTimeout = setTimeout(() => {
        socket.close();
    }, 30000 + 1000);
}

const sendPong = () => {
    const packet = new Packet();
    packet.setId("pong");
    const serialized = packet.serializeBinary();
    socket.send(serialized.buffer);
};

const sendHello = () => {
    const packet = new Packet();
    packet.setId("HelloRequest");

    const payload = new HelloRequest();

    payload.setName("John Doe");

    packet.setPayload(payload.serializeBinary());

    const serialized = packet.serializeBinary();
    socket.send(serialized.buffer);
};

const handleHelloResponse = (packet) => {
    const payload = packet.getPayload();
    const response = HelloResponse.deserializeBinary(payload);
    console.log(response.getMessage());
};

socket.onopen = function () {
    console.log("[open] Connection established");
    heartbeat();
    sendHello();
};

const messageHandlers = new Map();
messageHandlers.set("ping", () => {
    sendPong();
    heartbeat();
});
messageHandlers.set("HelloResponse", (packet) => {
    handleHelloResponse(packet);
});

socket.onmessage = async function (event) {
    const { data } = event;
    const buffer = await data.arrayBuffer();
    const packet = Packet.deserializeBinary(buffer);
    const packetId = packet.getId();
    console.log(`Received message with id "${packetId}"`);
    const handler = messageHandlers.get(packetId);
    if (handler) {
        handler(packet);
    }
};

socket.onclose = function (event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');
    }
};

socket.onerror = function (error) {
    console.log(`[error] ${error.message}`);
};

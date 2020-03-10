// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App.jsx';

// const mount = document.querySelector('#app-mount');

// ReactDOM.render(<App />, mount);

import { Packet, HelloRequest } from "../../generated/protobuf/Messages_pb";

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

socket.onopen = function () {
    console.log("[open] Connection established");
    heartbeat();
};

socket.onmessage = async function (event) {
    const { data } = event;
    const buffer = await data.arrayBuffer();
    const packet = Packet.deserializeBinary(buffer);
    const packetId = packet.getId();
    console.log(`Received message with id "${packetId}"`);
    if (packetId === "ping") {
        sendPong();
        heartbeat();
        return;
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

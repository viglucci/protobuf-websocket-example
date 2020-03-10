const { Packet, HelloRequest, HelloResponse } = require("../generated/protobuf/Messages_pb");

class HelloController {
    constructor() {

    }

    onHello(sock, bytes) {
        const request = HelloRequest.deserializeBinary(bytes);
        const name = request.getName();

        const response = new Packet();
        response.setId("HelloResponse");

        const payload = new HelloResponse();
        payload.setMessage(`Hello ${name}!`);

        response.setPayload(payload.serializeBinary());

        const message = response.serializeBinary();
        sock.send(message);
    }
}

module.exports = HelloController;

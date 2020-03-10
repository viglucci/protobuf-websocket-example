import React, { useEffect, useState } from 'react';
// import { HelloRequest } from '../../generated/rsocket/HelloService_pb';

const App = () => {
    const [messages, setMessages] = useState([]);
    return (
        <div>
            <h1>Hello from React</h1>
            <ul>
                {messages.map((message, i) => {
                    return <li key={i}>{message}</li>
                })}
            </ul>
        </div>
    );
};

export default App;

import { io } from 'socket.io-client';

const socket = io("/", {
    withCredentials: true,
    transports: ['websocket', 'polling'] // Try both transports
});

socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
});

export default socket;

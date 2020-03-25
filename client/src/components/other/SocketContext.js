import socketIOClient from "socket.io-client";

var token = sessionStorage.getItem("authToken");

//Central socket instance with token authorization
const socket = socketIOClient("http://localhost:3000", {
    query: {token: token}
});

/**
 * Central Socket instance
 * @return {SocketIOClient} - Central Socket instance
 */
export default socket;
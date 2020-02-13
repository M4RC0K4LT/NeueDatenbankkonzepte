import socketIOClient from "socket.io-client";

var token = sessionStorage.getItem("authToken");

const socket = socketIOClient("http://localhost:3000", {
    query: {token: token}
});

export default socket;
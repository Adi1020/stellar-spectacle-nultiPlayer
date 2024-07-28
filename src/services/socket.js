// src/services/socket.js
import { io } from "socket.io-client";

const URL = "https://space-multi-server.onrender.com/"; // Your backend server URL
const socket = io(URL, {
  autoConnect: false,
});

export default socket;




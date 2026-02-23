const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(express.static("public"));

// Store room data
const rooms = {};

io.on("connection", socket => {
    console.log("User connected:", socket.id);

    // HOST: Create a new call room
    socket.on("create-room", (roomId, username) => {
        rooms[roomId] = {
            host: { id: socket.id, name: username },
            participants: [],
            joinRequests: {}
        };
        socket.join(roomId);
        console.log("Room created:", roomId, "by", username);
    });

    // PARTICIPANT: Request to join
    socket.on("request-join", (roomId, username) => {
        if (!rooms[roomId]) {
            socket.emit("request-denied");
            return;
        }

        const room = rooms[roomId];
        const requestId = socket.id;
        
        // Store request
        room.joinRequests[requestId] = {
            id: requestId,
            username: username,
            socketId: socket.id
        };

        // Notify host
        io.to(room.host.id).emit("join-request", {
            id: requestId,
            username: username
        });

        console.log(username, "requested to join", roomId);
    });

    // HOST: Approve request
    socket.on("approve-request", (roomId, userId) => {
        const room = rooms[roomId];
        if (!room || !room.joinRequests[userId]) return;

        const userSocket = io.sockets.sockets.get(userId);
        const userName = room.joinRequests[userId].username;

        // Add to participants
        room.participants.push({ id: userId, name: userName });
        delete room.joinRequests[userId];

        // Notify approved user
        if (userSocket) {
            userSocket.emit("request-approved");
            userSocket.join(roomId);
        }

        // Update all in room
        io.to(roomId).emit("user-joined", { username: userName });
        console.log(userName, "approved to join", roomId);
    });

    // HOST: Deny request
    socket.on("deny-request", (roomId, userId) => {
        const room = rooms[roomId];
        if (!room || !room.joinRequests[userId]) return;

        const userSocket = io.sockets.sockets.get(userId);
        delete room.joinRequests[userId];

        if (userSocket) {
            userSocket.emit("request-denied");
        }
        console.log("Request denied for room", roomId);
    });

    // PARTICIPANT: Approved join - now fully join
    socket.on("join-room", (roomId, username) => {
        socket.roomId = roomId;
        socket.username = username;
        socket.join(roomId);
        io.to(roomId).emit("user-joined", { username: username });
        console.log(username, "joined", roomId);
    });

    // CHAT
    socket.on("chat-message", (roomId, username, text) => {
        io.to(roomId).emit("chat-message", username, text);
        console.log(username, "in", roomId, ":", text);
    });

    // LEAVE
    socket.on("leave-call", (roomId) => {
        if (socket.roomId) {
            io.to(socket.roomId).emit("user-left", socket.username || "User");
            socket.leave(socket.roomId);
            
            // Clean up room if empty
            if (rooms[socket.roomId]) {
                const room = rooms[socket.roomId];
                room.participants = room.participants.filter(p => p.id !== socket.id);
                if (room.participants.length === 0 && room.host.id !== socket.id) {
                    delete rooms[socket.roomId];
                }
            }
        }
    });

    socket.on("disconnect", () => {
        // Clean up join requests
        Object.values(rooms).forEach(room => {
            delete room.joinRequests[socket.id];
            room.participants = room.participants.filter(p => p.id !== socket.id);
        });
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
});

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Store room participants
const rooms = {};

io.on("connection", socket => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId, username) => {
        // Initialize room if it doesn't exist
        if (!rooms[roomId]) {
            rooms[roomId] = {};
        }
        
        // Max 8 users per room limit
        const currentUsers = Object.keys(rooms[roomId]).length;
        if (currentUsers >= 8) {
            socket.emit("room-full", { message: "This call is full (max 8 users). Try creating a new room." });
            return;
        }
        
        socket.join(roomId);
        
        // Store user info
        rooms[roomId][socket.id] = { username, socketId: socket.id };
        socket.username = username;
        socket.roomId = roomId;
        
        // Get all other users in the room
        const otherUsers = Object.values(rooms[roomId]).filter(user => user.socketId !== socket.id);
        
        // Send existing users to the new user
        socket.emit("existing-users", otherUsers);
        
        // Notify others about new user
        socket.to(roomId).emit("user-joined", { username, socketId: socket.id });
        
        // Send join notification to chat
        io.to(roomId).emit("chat-message", {
            username: "System",
            message: `${username} joined the room (${Object.keys(rooms[roomId]).length} users)`,
            timestamp: Date.now()
        });
    });

    socket.on("signal", (data) => {
        // Forward signal to specific user
        io.to(data.to).emit("signal", {
            from: socket.id,
            signal: data.signal
        });
    });

    socket.on("chat-message", (message) => {
        if (socket.roomId) {
            io.to(socket.roomId).emit("chat-message", {
                username: socket.username,
                message: message,
                timestamp: Date.now()
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        
        if (socket.roomId && rooms[socket.roomId]) {
            const username = rooms[socket.roomId][socket.id]?.username;
            
            // Remove user from room
            delete rooms[socket.roomId][socket.id];
            
            // Clean up empty rooms
            if (Object.keys(rooms[socket.roomId]).length === 0) {
                delete rooms[socket.roomId];
            }
            
            // Notify others
            socket.to(socket.roomId).emit("user-left", socket.id);
            
            if (username) {
                io.to(socket.roomId).emit("chat-message", {
                    username: "System",
                    message: `${username} left the room`,
                    timestamp: Date.now()
                });
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
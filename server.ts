import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Game state management
  const games = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_lobby", (gameId) => {
      socket.join(gameId);
      const room = io.sockets.adapter.rooms.get(gameId);
      const playerCount = room ? room.size : 0;
      io.to(gameId).emit("player_joined", { count: playerCount, socketId: socket.id });
    });

    socket.on("leave_lobby", (gameId) => {
      socket.leave(gameId);
      const room = io.sockets.adapter.rooms.get(gameId);
      const playerCount = room ? room.size : 0;
      io.to(gameId).emit("player_left", { count: playerCount, socketId: socket.id });
    });

    socket.on("start_game", (gameId) => {
      // In a real app, you'd validate players and start state
      io.to(gameId).emit("game_started", { gameId, players: Array.from(io.sockets.adapter.rooms.get(gameId) || []) });
    });

    socket.on("game_action", (data) => {
      // Broadcast action to everyone in the room
      io.to(data.gameId).emit("game_update", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

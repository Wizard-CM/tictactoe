import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

// Socket Related Logics

// New Socket Server Initialiazation
const io = new Server(server, {
  cors: "http://localhost:5173",
});

const allSocketUsers = [];

io.on("connection", (socket) => {
  allSocketUsers.push({
    socket: socket,
    isOnline: true,
    isPlaying: false,
    opponentName: "",
  });
  // Current User
  const currentUser = allSocketUsers.find((i) => i.socket.id === socket.id);

  socket.on("playOnline", (data) => {
    // adding PlayerUsername Logic
    allSocketUsers.forEach((socketUser) => {
      if (socketUser.socket.id === socket.id) {
        socketUser.username = data.playerName;
      }
    });
    socket.username = data.playerName;

    // Isplaying true logic
    currentUser.socket.on("userPlaying", (data) => {
      allSocketUsers.forEach((i) => {
        if (i.username === data.username && i.isOnline) {
          i.isPlaying = true;
        }
      });
    });

    // Finding Opponent Logic
    const opponent = allSocketUsers.find((socketUser) => {
      return (
        socketUser?.socket.id !== socket.id &&
        socketUser?.isOnline &&
        !socketUser?.isPlaying
      );
    });

    if (opponent?.socket?.id) {
      socket.opponentName = opponent.username;
      currentUser.opponentName = opponent.username;
      currentUser.socket.emit("opponentFound", {
        opponentName: opponent.username,
        IplayingAs: "circle",
      });
      opponent.socket.emit("opponentFound", {
        opponentName: currentUser.username,
        IplayingAs: "cross",
      });
      currentUser.socket.on("playerMoveFromClient", (data) => {
        opponent.socket.emit("playerMoveFromServer", { game: data.game });
      });
      opponent.socket.on("playerMoveFromClient", (data) => {
        currentUser.socket.emit("playerMoveFromServer", { game: data.game });
      });
    } else {
      currentUser.socket.emit("opponentNotFound");
    }
  });

  socket.on("disconnect", () => {
    allSocketUsers.forEach((socketUser) => {
      if (socketUser.socket.id === socket.id) {
        socketUser.isOnline = false;
        socketUser.isPlaying = false;
      }

      const opponent1 = allSocketUsers.find(
        (i) => i.username === socket.opponentName
      );
      opponent1?.socket.emit("opponentLeftTheMatch");

      console.log(allSocketUsers.find((i) => i.opponentName));
      const opponent2 = allSocketUsers.find(
        (i) => i.opponentName === socket.username
      );
      opponent2?.socket.emit("opponentLeftTheMatch");
    });
  });
});

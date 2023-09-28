import express from "express";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";

//Interfaces
import { UserSocket } from "./interfaces/userSocket";

const app = express();
const httpServer = createServer(app);

const io = new SocketServer(httpServer, {
  cors: {
    origin: "http://localhost:5173/",                
  }
});

const connectedUsers: UserSocket[] = []; // Array para almacenar usuarios conectados

io.on("connection", (socket) => {
  const customUserId = socket.handshake.auth.customUserId;
  // socket.id = customUserId;

  const user: UserSocket = {
    user: customUserId,
    socketId: socket.id,
  };
  connectedUsers.push(user);

  io.emit("connectedUsers", connectedUsers);

  socket.on("message", (data) => {
    const { recipient, message, usuario } = data;
    const toSend = connectedUsers.find(user => user.user === recipient)
    if (toSend) {
      io.to(toSend.socketId).emit("message", { message, usuario });
    } else {
      io.to(usuario).emit("message", { message: `El destinatario ${recipient} no se encuentra en la lista de usuarios conectados.`});
      console.log(`El destinatario ${recipient} no se encuentra en la lista de usuarios conectados.`);
    }
  });
  
  socket.on("disconnect", () => {
    const index = connectedUsers.findIndex((u) => u.user === customUserId);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
    }
    io.emit("connectedUsers", connectedUsers);
  });
  console.log(connectedUsers);
});

export default httpServer;
import express from "express";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from 'cors'
import morgan from "morgan";

//Routes
import AuthRoutes from "./routes/auth.routes";

//Interfaces
import { UserSocket } from "./interfaces/userSocket";

const app = express();
const httpServer = http.createServer(app);
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

const io = new SocketServer(httpServer, {
  cors: {
    origin: "http://localhost:5173",                
  }
});

export const connectedUsers: UserSocket[] = [];

io.on("connection", (socket) => {
  const customUserId = socket.handshake.auth.customUserId;

  const user: UserSocket = {
    user: {
      id: customUserId.id,
      username: customUserId.username,
    },
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

app.use("/api", AuthRoutes);

export default httpServer;
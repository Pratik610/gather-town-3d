import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import workspaceRoutes from "./routes/workspaceRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";

import session from "express-session";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow methods
  })
);

app.options("*", (req, res) => {
  res.sendStatus(200); // Respond with 200 to OPTIONS preflight requests
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/workspace", workspaceRoutes);

app.use(notFound);
app.use(errorHandler);

const httpServer = app.listen(process.env.PORT, () =>
  console.log("Server Running on PORT:", process.env.PORT)
);

const wss = new WebSocketServer({ server: httpServer });

const clients = new Map<string, { socket: WebSocket; data: any }>();
const rooms = new Map<string, { users: string[] }>();
const userToSocketId = new Map<string, string>();

wss.on("connection", (socket) => {
  const socketId = uuidv4();

  console.log(`Client connected: ${socketId}`);
  socket.on("error", console.error);

  socket.on("message", (data, isBinary) => {
    try {
      const message = isBinary ? data : data.toString();
      const userMessage = JSON.parse(message.toString());

      switch (userMessage.type) {
        case "join-workspace":
          handleJoinWorkspace(socketId, socket, userMessage);
          break;

        case "update-movements":
          handleUpdateMovements(socketId, userMessage);
          break;

        default:
          console.warn("Unknown message type:", userMessage.type);
          break;
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  socket.on("close", () => {
    handleDisconnect(socketId);
  });
});

function handleJoinWorkspace(
  socketId: string,
  socket: WebSocket,
  userMessage: any
) {
  clients.set(socketId, { socket, data: userMessage.userDetails });
  userToSocketId.set(userMessage.userDetails.id, socketId); // Add to the map

  const checkRoom = rooms.get(userMessage.workspaceId);
  if (!checkRoom) {
    rooms.set(userMessage.workspaceId, {
      users: [userMessage.userDetails.id],
    });
  } else {
    const room = rooms.get(userMessage.workspaceId);
    if (!room?.users.includes(userMessage.userDetails.id)) {
      room!.users.push(userMessage.userDetails.id);

      console.log(room?.users);

      rooms.set(userMessage.workspaceId, { users: room!.users });
    }
  }

  socket.send(
    JSON.stringify({
      type: "room-connected",
      status: true,
      workspaceId: userMessage.workspaceId,
    })
  );
}

function handleUpdateMovements(socketId: string, userMessage: any) {
  const client = clients.get(socketId);
  if (!client) return;

  client.data = { ...client.data, ...userMessage };

  const workspaceId = userMessage.workspaceId;

  const room = rooms.get(workspaceId);
  if (!room) return;

  const teammates = room.users
    .filter((userId) => userId !== client.data.id)
    .map((userId) => {
      const teammateSocketId = userToSocketId.get(userId);
      return clients.get(teammateSocketId || "");
    })
    .filter(Boolean);

  teammates.forEach((teammate) => {
    if (teammate!.socket.readyState === WebSocket.OPEN) {
      const players = room.users
        .filter((userId) => userId !== teammate!.data.id)
        .map((userId) => {
          const teammateSocketId = userToSocketId.get(userId);
          return clients.get(teammateSocketId || "");
        })
        .filter(Boolean)
        .map((player) => ({
          ...player!.data,
          id: player!.data.id,
        }));

      teammate!.socket.send(
        JSON.stringify({
          type: "update-users-`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             state",
          players,
        })
      );
    }
  });
}
function handleDisconnect(socketId: string) {
  const client = clients.get(socketId);
  if (client) {
    const userId = client.data.id;

    // Remove from rooms
    rooms.forEach((room, workspaceId) => {
      const updatedUsers = room.users.filter((id) => id !== userId);
      if (updatedUsers.length > 0) {
        rooms.set(workspaceId, { users: updatedUsers });
      } else {
        rooms.delete(workspaceId);
      }
    });

    // Remove from clients and userToSocketId
    clients.delete(socketId);
    userToSocketId.delete(userId);
  }

  console.log(rooms);
  console.log(`Client disconnected: ${socketId}`);
}

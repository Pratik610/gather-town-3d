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
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret", // Secret for signing the session ID cookie
    resave: false, // Don't resave session if not modified
    saveUninitialized: false, // Don't save an uninitialized session
    cookie: {
      httpOnly: true, // Ensures cookies are not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
      sameSite: "none", // Allow cross-origin requests with cookies
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/workspace", workspaceRoutes);

app.use(notFound);
app.use(errorHandler);

const httpServer = app.listen(process.env.PORT, () =>
  console.log("Server Running on PORT:", process.env.PORT)
);

const wss = new WebSocketServer({ server: httpServer });

const clients = new Map<string, { socket: WebSocket; data: Partial<Data> }>();

type Data = {
  x: number;
  y: number;
  z: number;
  direction: string;
  isRunning: boolean;
};

wss.on("connection", (socket) => {
  const id = uuidv4(); // Unique client ID
  clients.set(id, { socket, data: {} });
  console.log(`Client connected: ${id}`);

  socket.on("error", console.error);

  socket.on("message", (data, isBinary) => {
    const message = isBinary ? data : data.toString();
    const userMessage = JSON.parse(message.toString());

    switch (userMessage.type) {
      case "update-movements":
        const client = clients.get(id);

        if (client) {
          client.data = { ...client.data, ...userMessage };

          const teammates = Array.from(clients).filter(
            (item) => item[0] !== id
          );

          teammates.forEach((player) => {
            if (player[1].socket.readyState === WebSocket.OPEN) {
              const teammatesPostion = Array.from(clients).filter(
                (item) => item[0] !== player[0]
              );

              player[1].socket.send(
                JSON.stringify({
                  type: "update-users-state",
                  players: teammatesPostion.map((item) => ({
                    ...item[1].data,
                    id: item[0],
                  })),
                })
              );
            }
          });
        }
        break;

      default:
        break;
    }
  });

  socket.on("close", () => {
    console.log(`Client disconnected: ${id}`);
    clients.delete(id);
  });
});

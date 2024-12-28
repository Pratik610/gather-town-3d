import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });

// Store WebSocket instances and associated client data
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
  clients.set(id, { socket, data: {} }); // Add client with empty initial data
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
    clients.delete(id); // Remove the client on disconnect
  });
});

import { WebSocketServer, WebSocket } from "ws";

import type { Server as HttpServer } from "node:http";
import type { IncomingMessage } from "node:http";

type ChatMessage = {
  id: string;
  exhibitionId: string;
  userName: string;
  message: string;
  timestamp: number;
};

type Client = {
  socket: WebSocket;
  exhibitionId: string;
  userName: string;
};

const clients = new Set<Client>();

function generateUserName() {
  return `User ${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getExhibitionIdFromUrl(url: string | undefined) {
  if (!url) {
    return null;
  }

  const match = url.match(/^\/ws\/chat\/exhibition\/([^/?]+)$/);

  return match?.[1] ?? null;
}

function broadcastToExhibition(exhibitionId: string, message: ChatMessage) {
  const serializedMessage = JSON.stringify(message);

  for (const client of clients) {
    if (
      client.exhibitionId === exhibitionId &&
      client.socket.readyState === WebSocket.OPEN
    ) {
      client.socket.send(serializedMessage);
    }
  }
}

export function setupChatWebSocket(server: HttpServer) {
  const wss = new WebSocketServer({
    server,
  });

  wss.on("connection", (socket, request: IncomingMessage) => {
    console.log("WebSocket connection attempt:", request.url);

    const exhibitionId = getExhibitionIdFromUrl(request.url);

    if (!exhibitionId) {
      console.error("Invalid WebSocket exhibition URL:", request.url);

      socket.close(1008, "Invalid exhibition");
      return;
    }

    const client: Client = {
      socket,
      exhibitionId,
      userName: generateUserName(),
    };

    clients.add(client);

    console.log(
      `WebSocket connected: ${client.userName} -> exhibition ${exhibitionId}`
    );

    socket.send(
      JSON.stringify({
        type: "connected",
        userName: client.userName,
      })
    );

    socket.on("message", (rawMessage) => {
      try {
        const data = JSON.parse(rawMessage.toString());

        if (data.type !== "message") {
          return;
        }

        if (typeof data.message !== "string") {
          return;
        }

        const message = data.message.trim();

        if (!message) {
          return;
        }

        if (message.length > 300) {
          return;
        }

        const chatMessage: ChatMessage = {
          id: generateMessageId(),
          exhibitionId: client.exhibitionId,
          userName: client.userName,
          message,
          timestamp: Date.now(),
        };

        broadcastToExhibition(client.exhibitionId, chatMessage);
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    });

    socket.on("close", () => {
      clients.delete(client);

      console.log(
        `WebSocket disconnected: ${client.userName} -> exhibition ${exhibitionId}`
      );
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);

      clients.delete(client);
    });
  });

  console.log("WebSocket chat server initialized.");
}

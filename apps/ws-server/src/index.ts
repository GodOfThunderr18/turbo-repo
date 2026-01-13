import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Store active connections per room
const rooms = new Map<string, Set<any>>();

// Store message history per room
const messageHistory = new Map<string, Array<{ user: string; text: string; timestamp: number }>>();

wss.on('connection', (ws) => {
  let currentRoom: string | null = null;

  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());

    if (message.type === 'join') {
      currentRoom = message.room;
      if (currentRoom && !rooms.has(currentRoom)) {
        rooms.set(currentRoom, new Set());
      }
      if (currentRoom && !messageHistory.has(currentRoom)) {
        messageHistory.set(currentRoom, []);
      }
      if (currentRoom) {
        rooms.get(currentRoom)?.add(ws);
        console.log(`User joined room: ${currentRoom}`);
        
        // Send message history to the newly joined user
        const history = messageHistory.get(currentRoom);
        if (history && history.length > 0) {
          ws.send(JSON.stringify({
            type: 'history',
            messages: history,
          }));
        }
      }
    }

    if (message.type === 'chat' && currentRoom) {
      const chatMessage = {
        user: message.user,
        text: message.text,
        timestamp: Date.now(),
      };
      
      // Store message in history
      const history = messageHistory.get(currentRoom);
      if (history) {
        history.push(chatMessage);
        // Keep only last 100 messages per room
        if (history.length > 100) {
          history.shift();
        }
      }
      
      // Broadcast message to all users in the room
      const roomUsers = rooms.get(currentRoom);
      roomUsers?.forEach((client) => {
        client.send(JSON.stringify({
          type: 'chat',
          text: message.text,
          user: message.user,
        }));
      });
    }
  });

  ws.on('close', () => {
    if (currentRoom) {
      rooms.get(currentRoom)?.delete(ws);
      console.log(`User left room: ${currentRoom}`);
    }
  });
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
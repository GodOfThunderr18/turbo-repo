"use client";
import { TextInput } from "@repo/ui/text-input";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomid as string;
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Array<{ user: string; text: string }>>([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem("chatUser");
    if (!user) {
      router.push("/signin");
      return;
    }
    setUsername(JSON.parse(user).username);

    // Connect to WebSocket server
    wsRef.current = new WebSocket("ws://localhost:3002");

    wsRef.current.onopen = () => {
      wsRef.current?.send(JSON.stringify({ type: "join", room: roomId }));
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        setMessages((prev) => [...prev, { user: message.user, text: message.text }]);
      } else if (message.type === "history") {
        // Load message history when joining room
        setMessages(message.messages.map((msg: any) => ({ user: msg.user, text: msg.text })));
      }
    };

    return () => wsRef.current?.close();
  }, [roomId, router]);

  const handleSendMessage = () => {
    if (inputText.trim() && wsRef.current && username) {
      wsRef.current.send(JSON.stringify({ type: "chat", text: inputText, user: username }));
      setInputText("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("chatUser");
    router.push("/signin");
  };

  if (!username) return null;

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ 
        padding: "15px 20px", 
        backgroundColor: "#667eea", 
        color: "white", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Room: {roomId}</h2>
          <p style={{ margin: 0, fontSize: "12px", opacity: 0.9 }}>Logged in as {username}</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => router.push("/chats/lobby")}
            style={{
              padding: "8px 16px",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Lobby
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", backgroundColor: "#f5f5f5" }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{ 
              marginBottom: "12px", 
              padding: "12px", 
              backgroundColor: msg.user === username ? "#e3f2fd" : "white",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
            }}>
              <strong style={{ color: "#667eea" }}>{msg.user}:</strong> <span style={{ marginLeft: "8px" }}>{msg.text}</span>
            </div>
          ))
        )}
      </div>
      <div style={{ padding: "15px 20px", backgroundColor: "white", borderTop: "1px solid #ddd", display: "flex", gap: "10px" }}>
        <TextInput 
          placeholder="Chat here" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid black",
            backgroundColor: "#667eea",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
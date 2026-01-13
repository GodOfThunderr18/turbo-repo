"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LobbyPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("chatUser");
    if (!user) {
      router.push("/signin");
    } else {
      setUsername(JSON.parse(user).username);
    }
  }, [router]);

  const joinRoom = () => {
    if (roomId.trim()) {
      router.push(`/chats/${roomId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("chatUser");
    router.push("/signin");
  };

  if (!username) return null;

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        padding: "40px",
        width: "500px",
        maxWidth: "90%",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#333", marginBottom: "4px" }}>
              Welcome, {username}!
            </h1>
            <p style={{ color: "#666", fontSize: "14px" }}>Choose or create a chat room</p>
          </div>
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

        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#555", marginBottom: "8px" }}>
            Room ID
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && joinRoom()}
            placeholder="Enter room ID (e.g., room1, general, tech)"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "12px",
            }}
          />
          <button
            onClick={joinRoom}
            style={{
              width: "100%",
              backgroundColor: "#667eea",
              color: "white",
              fontWeight: "600",
              padding: "14px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Join Room
          </button>
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <p style={{ fontSize: "14px", fontWeight: "500", color: "#555", marginBottom: "12px" }}>
            Quick Join:
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["general", "tech", "random"].map((room) => (
              <button
                key={room}
                onClick={() => router.push(`/chats/${room}`)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: "500",
                  color: "#555",
                }}
              >
                #{room}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("chatUser");
    if (user) {
      router.push("/chats/lobby");
    } else {
      router.push("/signin");
    }
  }, [router]);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '20px',
    }}>
      Loading...
    </div>
  );
}

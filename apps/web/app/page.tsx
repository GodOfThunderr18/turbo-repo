"use client"
import { TextInput } from '@repo/ui/text-input';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router=useRouter();
  return (
    <div style={
      {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        background: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }>
      <TextInput placeholder='Enter room name'></TextInput>
      <button onClick={()=>{
        router.push("/chat/123")
      }
      }>Join room</button>
      
      
    </div>
  );
}

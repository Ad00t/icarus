'use client'

import { useState, useEffect } from "react";
import Clock from "@/components/clock";
import ReadingBox from "@/components/reading-box";
import SerialInterface from "@/components/serial-interface";
import SerialManager from "@/lib/SerialManager";

export default function Home() {
  const [ serialManager, setSerialManager ] = useState(null);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ lastReading, setLastReading] = useState('');

  function onDataRecv(data) {
    setLastReading(data);
  }

  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  useEffect(() => {
    const manager = new SerialManager(onDataRecv, onConnect, onDisconnect);
    setSerialManager(manager);
    return () => {
      manager?.disconnect();
    };
  }, []);

  return (
    <div>
      <Clock />
      <ReadingBox 
        title="LAST READING" 
        reading={lastReading} 
        posx={100} posy={100} 
        width={200} height={300}
      />
      <SerialInterface 
        isConnected={isConnected} 
        connect={async () => await serialManager?.connect()} 
        disconnect={async () => await serialManager?.disconnect()}
        posx={350} posy={100} 
        width={200} height={300} 
      />
    </div>
  );
}


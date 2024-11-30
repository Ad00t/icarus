'use client'

import { useState, useEffect } from "react";
import Clock from "@/components/clock";
import LastReading from "@/components/last-reading";
import SerialInterface from "@/components/serial-interface";
import EventLog from "@/components/event-log";
import SerialManager from "@/lib/serial-manager";

export default function Home() {
  const [ serialManager, setSerialManager ] = useState(null);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ serialInfo, setSerialInfo ] = useState("");
  const [ lastReading, setLastReading] = useState({});
  const [ eventLog, setEventLog ] = useState([]);

  function onPacketRecv(pobj) {
    switch (pobj.ptype) {
      case 0:
        setLastReading(pobj);
        break;
      case 1:
        setEventLog(prev => [ ...prev, pobj ]);
        break;
    }
  }

  useEffect(() => {
    const manager = new SerialManager(onPacketRecv, setIsConnected, setSerialInfo);
    setSerialManager(manager);
    return () => {
      manager?.disconnect();
    };
  }, []);

  return (
    <div>
      <Clock />
      <SerialInterface 
        isConnected={isConnected} 
        connect={async () => await serialManager?.connect()} 
        disconnect={async () => await serialManager?.disconnect()}
        serialInfo={serialInfo}
        posx={50} posy={50} 
        width={200} height={180} 
      />
      <LastReading 
        reading={lastReading} 
        posx={50} posy={250} 
        width={200} height={400}
      />
      <EventLog
        eventLog={eventLog}
        posx={1100} posy={50}
        width={375} height={200} />
    </div>
  );
}


'use client'

import { useState, useEffect } from "react";
import SerialManager from "@/lib/serial-manager";
import Clock from "@/components/clock";
import LastReading from "@/components/last-reading";
import SerialInterface from "@/components/serial-interface";
import EventLog from "@/components/event-log";
import Attitude from "@/components/attitude";
import dynamic from "next/dynamic";
const ThreeDView = dynamic(() => import("@/components/3d-view"), { ssr: false });

export default function Home() {
  const [ serialManager, setSerialManager ] = useState(null);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ serialInfo, setSerialInfo ] = useState("");
  const [ lastReading, setLastReading] = useState({});
  const [ attitudes, setAttitudes ] = useState([ {
    "ts": Date.now(),
    "yaw": 0, "pitch": 0, "roll": 0,
    "a_x": 0, "a_y": 0, "a_z": 0,
    "v_x": 0, "v_y": 0, "v_z": 0,
    "x": 0, "y": 0, "z": 0,
  } ]);
  const [ eventLog, setEventLog ] = useState([]);

  function onPacketRecv(pobj) {
    switch (pobj.ptype) {
      case 0:
        setLastReading(pobj);
        setAttitudes(prev => [ ...prev, calculateAttitude(pobj) ]);
        break;
      case 1:
        setEventLog(prev => [ ...prev, pobj ]);
        break;
    }
  }

  function calculateAttitude(pobj) {
    const att = {};
    att.ts = pobj.rx_ts;
    att.yaw = pobj.yaw;
    att.pitch = pobj.pitch;
    att.roll = pobj.roll;
    att.a_x = pobj.a_x;
    att.a_y = pobj.a_y;
    att.a_z = pobj.a_z;
    let last_att = attitudes[attitudes.length - 1];
    let dt = (att.ts - last_att.ts) / 1000.0;
    att.v_x = last_att.v_x + att.a_x * dt;
    att.v_y = last_att.v_y + att.a_y * dt;
    att.v_z = last_att.v_z + att.a_z * dt;
    att.x = last_att.x + att.v_x * dt;
    att.y = last_att.y + att.v_y * dt;
    att.z = last_att.z + att.v_z * dt;
    return att;
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
      <Clock 
        posx={240} posy={10} 
        width={425} height={85} 
      />
      <SerialInterface 
        isConnected={isConnected} 
        connect={async () => await serialManager?.connect()} 
        disconnect={async () => await serialManager?.disconnect()}
        serialInfo={serialInfo}
        posx={10} posy={10} 
        width={220} height={180} 
      />
      <LastReading 
        reading={lastReading} 
        posx={10} posy={200} 
        width={220} height={470}
      />
      <ThreeDView 
        attitudes={attitudes}
        posx={240} posy={105}
        width={700} height={565}
      />
      <EventLog
        eventLog={eventLog}
        posx={10} posy={680}
        width={375} height={170} />
      <Attitude
        attitudes={attitudes}
        posx={395} posy={680}
        width={450} height={170}
      />
    </div>
  );
}


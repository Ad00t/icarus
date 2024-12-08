'use client'

import { useState, useEffect, useRef } from "react";
import SerialManager from "@/lib/serial-manager";
import Clock from "@/components/clock";
import LastReading from "@/components/last-reading";
import SerialInterface from "@/components/serial-interface";
import EventLog from "@/components/event-log";
import Pose from "@/components/current-pose";
import dynamic from "next/dynamic";
const ThreeDView = dynamic(() => import("@/components/3d-view"), { ssr: false });
import * as THREE from "three";

export default function Home() {
  const [ serialManager, setSerialManager ] = useState(null);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ serialInfo, setSerialInfo ] = useState("");
  const [ lastReading, setLastReading] = useState({});
  const posesRef = useRef([ {
    "quat": new THREE.Quaternion(0, 0, 0, 0),
    "acc": new THREE.Vector3(0, 0, 0),
    "vel": new THREE.Vector3(0, 0, 0),
    "pos": new THREE.Vector3(0, 0, 0),
  } ]);
  const [ eventLog, setEventLog ] = useState([]);

  function onPacketRecv(pobj) {
    switch (pobj.ptype) {
      case 0:
        setLastReading(pobj);
        posesRef.current.push(calculatePose(pobj));
        break;
      case 1:
        setEventLog(prev => [ ...prev, pobj ]);
        break;
    }
  }

  function clamp(value, threshold = 1e-3) {
    return Math.abs(value) < threshold ? 0 : value;
  }

  const alignToZneg = new THREE.Quaternion();
  alignToZneg.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);

  function calculatePose(pobj) {
    const pose = { 'ts': pobj.rx_ts };
    pose.quat = new THREE.Quaternion(pobj.qi, pobj.qj, pobj.qk, pobj.qr);
    pose.acc = new THREE.Vector3(clamp(pobj.lax), clamp(pobj.lay), clamp(pobj.laz));
    pose.acc.applyQuaternion(pose.quat);
    pose.quat.multiply(alignToZneg);

    let lastPose = posesRef.current[posesRef.current.length - 1];
    if (!lastPose.ts) lastPose.ts = pose.ts;
    let dt = (pose.ts - lastPose.ts) / 1000.0;
    console.log('dt:', dt);

    pose.vel = lastPose.vel.clone().addScaledVector(pose.acc, dt);
    pose.vel.setComponent(2, Math.max(0, pose.vel.z));
    pose.pos = lastPose.pos.clone().addScaledVector(pose.vel, dt);
    pose.pos.setComponent(2, Math.max(0, pose.pos.z));
    return pose;
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
        width={220} height={640}
      />
      <ThreeDView 
        posesRef={posesRef}
        posx={240} posy={105}
        width={760} height={555}
      />
      <EventLog
        eventLog={eventLog}
        posx={240} posy={670}
        width={375} height={170} />
      <Pose
        posesRef={posesRef}
        posx={625} posy={670}
        width={375} height={170}
      />
    </div>
  );
}


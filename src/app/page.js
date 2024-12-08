'use client'

import { useState, useEffect, useRef } from "react";
import SerialManager from "@/lib/serial-manager";
import Clock from "@/components/clock";
import LastReading from "@/components/last-reading";
import SerialInterface from "@/components/serial-interface";
import EventLog from "@/components/event-log";
import CurrentPose from "@/components/current-pose";
import Charts from "@/components/charts";
import Controls from "@/components/controls";
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
  const [ chartData, setChartData ] = useState({ "pps": [], "rssi": [], "acc": [], "vel": [], "pos": [] });
  const [ eventLog, setEventLog ] = useState([]);
  const csvWriterRef = useRef(null);

  let packetCount = 0;

  function appendChartData(chart, chartPoint) {
    setChartData(prev => ({ ...prev, [chart]: [ ...prev[chart].slice(Math.max(0, prev[chart].length > 600 ? prev[chart].length - 500 : 0)), chartPoint ] }));
  }

  function onPacketRecv(pobj) {
    switch (pobj.ptype) {
      case 0:
        setLastReading(pobj);
        let pose = calculatePose(pobj)
        posesRef.current.push(pose);
        if ('rssi' in pobj) {
          appendChartData("rssi", { "ts": pose.ts, "rssi": pobj.rssi });
          packetCount++;
        }
        appendChartData("acc", { "ts": pose.ts, "ax": pose.acc.x, "ay": pose.acc.y, "az": pose.acc.z });
        appendChartData("vel", { "ts": pose.ts, "vx": pose.vel.x, "vy": pose.vel.y, "vz": pose.vel.z });
        appendChartData("pos", { "ts": pose.ts, "px": pose.pos.x, "py": pose.pos.y, "pz": pose.pos.z });
        break;
      case 1:
        setEventLog(prev => [ ...prev, pobj ]);
        break;
    }
    if (csvWriterRef.current) {
      csvWriterRef.current.writeRecords(pobj);
    }
  }

  function clamp(value, threshold = 1e-2) {
    // return Math.abs(value) < threshold ? 0 : value;
    return value;
  }

  const alignToZneg = new THREE.Quaternion();
  alignToZneg.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);

  function calculatePose(pobj) {
    const pose = { 'ts': pobj.ts / 1000.0 };
    pose.quat = new THREE.Quaternion(pobj.qi, pobj.qj, pobj.qk, pobj.qr);
    let accQuat = pose.quat.clone();
    pose.quat.multiply(alignToZneg);
    pose.acc = new THREE.Vector3(clamp(pobj.lax), clamp(pobj.lay), clamp(pobj.laz));
    // pose.acc = new THREE.Vector3(0, 0, 0);
    pose.acc.applyQuaternion(accQuat);

    let lastPose = posesRef.current[posesRef.current.length - 1];
    if (!lastPose.ts) lastPose.ts = pose.ts;
    let dt = pose.ts - lastPose.ts;

    pose.vel = lastPose.vel.clone().addScaledVector(pose.acc, dt);
    pose.vel = pose.vel.set(clamp(pose.vel.x), clamp(pose.vel.y), clamp(pose.vel.z));
    pose.pos = lastPose.pos.clone().addScaledVector(pose.vel, dt);
    pose.pos = pose.pos.setComponent(2, Math.max(0, pose.pos.z));
    return pose;
  }

  useEffect(() => {
    const manager = new SerialManager(onPacketRecv, setIsConnected, setSerialInfo);
    setSerialManager(manager);
    const ppsInterval = setInterval(() => {
      appendChartData("pps", { ts: new Date().toTimeString().slice(0, 8), pps: packetCount });
      packetCount = 0;
    }, 1000);
    return () => {
      manager?.disconnect();
      clearInterval(ppsInterval);
    };
  }, []);

  return (
    <div>
      <Clock 
        posx={240} posy={10} 
        width={425} height={85} 
      />
      <Controls 
        posesRef={posesRef}
        setChartData={setChartData}
        csvWriterRef={csvWriterRef}
        posx={675} posy={10} 
        width={325} height={85} 
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
        width={220} height={655}
      />
      <ThreeDView 
        posesRef={posesRef}
        posx={240} posy={105}
        width={760} height={555}
      />
      <EventLog
        eventLog={eventLog}
        posx={240} posy={670}
        width={375} height={185} />
      <CurrentPose
        posesRef={posesRef}
        posx={625} posy={670}
        width={375} height={185}
      />
      <Charts
        chartData={chartData}
        posx={1010} posy={10}
        width={515} height={845}
      />
    </div>
  );
}


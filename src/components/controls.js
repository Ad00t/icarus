'use client'

import { useState } from "react";
import ComponentBox from "@/components/component-box";
import { Grid2, Button, IconButton } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import * as THREE from "three";

export default function Controls({ posesRef, setChartData, csvWriterRef, posx, posy, width, height }) {
  const [ isRecording, setIsRecording ] = useState(Boolean(csvWriterRef.current));

  function onReset() {
    console.log("RESET");
    posesRef.current = [{
      "quat": new THREE.Quaternion(0, 0, 0, 0),
      "acc": new THREE.Vector3(0, 0, 0),
      "vel": new THREE.Vector3(0, 0, 0),
      "pos": new THREE.Vector3(0, 0, 0),
    }];
    setChartData({ "pps": [], "rssi": [], "alt": [], "acc": [], "vel": [], "pos": [] });
  }

  function recordingToggle() {
    if (isRecording) {
      setIsRecording(false);
      csvWriterRef.current = null;
    } else {
      setIsRecording(true);
      // let dirpath = `${new Date().toISOString()}`;
      // fs.mkdirSync(dirpath, { recursive: true });
      // csvWriterRef.current = createObjectCsvWriter({
      //   path: `${dirpath}/packets.csv`,
      //   header: [ 'ts', 'ptype', 'src', 'dest', 'rssi', 'gyro_cal', 'lacc_cal', 'qr', 'qi', 'qj', 'qk', 'lax', 'lay', 'laz', 'temperature', 'pressure', 'altitude', 'level', 'desc' ]
      // });
      csvWriterRef.current = true;
    }
  }

  return (
    <ComponentBox
      posx={posx} posy={posy}
      width={width} height={height}
    >
      <Grid2 
        sx={{ marginTop: 'auto', marginBottom: 'auto' }} 
        container 
        spacing={3} 
        justifyContent="center"
      >
        <Button
          sx={{ width: '10px' }}
          variant="contained"
          onClick={onReset}
        >
          RESET
        </Button>
        <IconButton
          variant="contained"
          onClick={recordingToggle}
          color="error"
        >
          { isRecording ? <StopCircleIcon /> : <FiberManualRecordIcon /> }
        </IconButton>
      </Grid2>
    </ComponentBox>
  );
}
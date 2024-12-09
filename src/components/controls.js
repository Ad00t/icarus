'use client'

import { useState } from "react";
import ComponentBox from "@/components/component-box";
import { Grid2, Button, IconButton } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import * as THREE from "three";

export default function Controls({ posesRef, setChartData, isCapturingRef, datalogRef, melRef, posx, posy, width, height }) {
  const [ isCapturingState, setIsCapturingState ] = useState(isCapturingRef.current);

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

  async function recordingToggle() {
    if (isCapturingRef.current) {
      isCapturingRef.current = false;
      setIsCapturingState(false);
      try {
        const folder = new Date().toISOString().replace(/:/g, '-');

        const datalogRes = await fetch('/api/write-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fp: `${folder}/datalog.csv`, data: datalogRef.current }),
        });
        const datalogResult = await datalogRes.json();
        console.log(datalogResult.message);

        const melRes = await fetch('/api/write-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fp: `${folder}/mel.csv`, data: melRef.current }),
        });
        const melResult = await melRes.json();
        console.log(melResult.message);

        datalogRef.current = [];
        melRef.current = [];
      } catch (error) {
        console.error('Error exporting CSV:', error);
      }
    } else {
      isCapturingRef.current = true;
      setIsCapturingState(true);
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
          { isCapturingState ? <StopCircleIcon /> : <FiberManualRecordIcon /> }
        </IconButton>
      </Grid2>
    </ComponentBox>
  );
}
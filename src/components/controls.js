'use client'

import React from "react";
import ComponentBox from "@/components/component-box";
import { Button, Grid2 } from "@mui/material";
import * as THREE from "three";

export default function Controls({ posesRef, setChartData, posx, posy, width, height }) {
  function onReset() {
    console.log("RESET");
    posesRef.current = [{
      "quat": new THREE.Quaternion(0, 0, 0, 0),
      "acc": new THREE.Vector3(0, 0, 0),
      "vel": new THREE.Vector3(0, 0, 0),
      "pos": new THREE.Vector3(0, 0, 0),
    }];
    setChartData([]);
  }

  return (
    <ComponentBox
      posx={posx} posy={posy}
      width={width} height={height}
    >
      <Button
        sx={{ width: '10px', margin: 'auto' }}
        variant="contained"
        onClick={onReset}
      >
        RESET
      </Button>
    </ComponentBox>
  );
}
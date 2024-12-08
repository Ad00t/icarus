'use client'

import React from "react";
import ComponentBox from "@/components/component-box";
import { Typography, Grid2 } from "@mui/material";

export default function Pose({ posesRef, posx, posy, width, height }) {
  function createPoseLabel(type, component, label, r=2) {
    let val = posesRef.current[posesRef.current.length - 1][type][component];
    val = Math.round((val + Number.EPSILON) * Math.pow(10, r)) / Math.pow(10, r);
    return (
      <Typography variant="body1" color="black">
        { `${label.toUpperCase()}: ${val}` }
      </Typography>
    );
  } 

  return (
    <ComponentBox
      title="CURRENT POSE"
      posx={posx} posy={posy}
      width={width} height={height}
    >
      <Grid2 justifyContent="center" container spacing={3}>
        <Grid2 xs={3}>
          { createPoseLabel('quat', 'w', 'qr') }
          { createPoseLabel('quat', 'x', 'qi') }
          { createPoseLabel('quat', 'y', 'qj') }
          { createPoseLabel('quat', 'z', 'qk') }
        </Grid2>

        <Grid2 xs={3}>
          { createPoseLabel('pos', 'x', 'x') }
          { createPoseLabel('pos', 'y', 'y') }
          { createPoseLabel('pos', 'z', 'z') }
        </Grid2>

        <Grid2 xs={3}>
          { createPoseLabel('vel', 'x', 'vx') }
          { createPoseLabel('vel', 'y', 'vy') }
          { createPoseLabel('vel', 'z', 'vz') }
        </Grid2>

        <Grid2 xs={3}>
          { createPoseLabel('acc', 'x', 'ax') }
          { createPoseLabel('acc', 'y', 'ay') }
          { createPoseLabel('acc', 'z', 'az') }
        </Grid2>
      </Grid2>
    </ComponentBox>
  );
}
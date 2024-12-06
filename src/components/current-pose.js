'use client'

import React from "react";
import ComponentBox from "@/components/component-box";
import { Typography, Grid2 } from "@mui/material";

export default function Pose({ posesRef, posx, posy, width, height }) {
  function createPoseLabel(key, r=2) {
    let val = Math.round((posesRef.current[posesRef.current.length - 1][key] + Number.EPSILON) * Math.pow(10, r)) / Math.pow(10, r);
    return (
      <Typography variant="body1" color="black">
        { `${key.toUpperCase()}: ${val}` }
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
          { createPoseLabel('qr') }
          { createPoseLabel('qi') }
          { createPoseLabel('qj') }
          { createPoseLabel('qk') }
        </Grid2>

        <Grid2 xs={3}>
          { createPoseLabel('x') }
          { createPoseLabel('y') }
          { createPoseLabel('z') }
        </Grid2>

        <Grid2 xs={3}>
          { createPoseLabel('vx') }
          { createPoseLabel('vy') }
          { createPoseLabel('vz') }
        </Grid2>

        <Grid2 xs={3}>
          { createPoseLabel('ax') }
          { createPoseLabel('ay') }
          { createPoseLabel('az') }
        </Grid2>
      </Grid2>
    </ComponentBox>
  );
}
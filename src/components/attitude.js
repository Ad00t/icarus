'use client'

import React from "react";
import ComponentBox from "@/components/component-box";
import { Typography, Grid2 } from "@mui/material";

export default function Attitude({ attitudesRef, attitudesLength, posx, posy, width, height }) {
  function createAttLabel(key, r=2) {
    let val = Math.round((attitudesRef.current[attitudesRef.current.length - 1][key] + Number.EPSILON) * Math.pow(10, r)) / Math.pow(10, r);
    return (
      <Typography variant="body1" color="black">
        { `${key.toUpperCase()}: ${val}` }
      </Typography>
    );
  } 

  return (
    <ComponentBox
      title="ATTITUDE"
      posx={posx} posy={posy}
      width={width} height={height}
    >
      <Grid2 justifyContent="center" container spacing={2}>
        <Grid2 xs={3}>
          { createAttLabel('qr') }
          { createAttLabel('qi') }
          { createAttLabel('qj') }
          { createAttLabel('qk') }
        </Grid2>

        <Grid2 xs={3}>
          { createAttLabel('x') }
          { createAttLabel('y') }
          { createAttLabel('z') }
        </Grid2>

        <Grid2 xs={3}>
          { createAttLabel('vx') }
          { createAttLabel('vy') }
          { createAttLabel('vz') }
        </Grid2>

        <Grid2 xs={3}>
          { createAttLabel('ax') }
          { createAttLabel('ay') }
          { createAttLabel('az') }
        </Grid2>
      </Grid2>
    </ComponentBox>
  );
}
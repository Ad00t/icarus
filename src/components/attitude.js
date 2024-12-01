'use client'

import React from "react";
import ComponentBox from "@/components/component-box";
import { Typography, Grid2 } from "@mui/material";

export default function Attitude({ attitudes, posx, posy, width, height }) {
  function createAttLabel(key, r=2) {
    let val = Math.round((attitudes[attitudes.length - 1][key] + Number.EPSILON) * Math.pow(10, r)) / Math.pow(10, r);
    return (
      <Typography variant="body1" color="black" gutterBottom>
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
      <Grid2 justifyContent="center" container spacing={3} margin="10px">
        <Grid2 item xs={3}>
          { createAttLabel('yaw') }
          { createAttLabel('pitch') }
          { createAttLabel('roll') }
        </Grid2>

        <Grid2 item xs={3}>
          { createAttLabel('x') }
          { createAttLabel('y') }
          { createAttLabel('z') }
        </Grid2>

        <Grid2 item xs={3}>
          { createAttLabel('v_x') }
          { createAttLabel('v_y') }
          { createAttLabel('v_z') }
        </Grid2>

        <Grid2 item xs={3}>
          { createAttLabel('a_x') }
          { createAttLabel('a_y') }
          { createAttLabel('a_z') }
        </Grid2>
      </Grid2>
    </ComponentBox>
  );
}
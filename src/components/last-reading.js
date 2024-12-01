'use client'

import React from "react";
import ComponentBox from "@/components/component-box";
import { Typography, Grid2 } from "@mui/material";

export default function LastReading({ reading, posx, posy, width, height }) {
  return (
    <ComponentBox
      title="LAST READING"
      posx={posx} posy={posy}
      width={width} height={height}
    >
      <Grid2 container justifyContent="center">
        <Grid2 item xs={12}>
          {
            Object.keys(reading).map(key => (
              <Typography
                variant="body1" 
                color="black"
                key={key}
                gutterBottom
              >
                { `${key}: ${reading[key]}` }
                <br />
              </Typography>
            ))
          }
        </Grid2>
      </Grid2>
    </ComponentBox>
  );
}
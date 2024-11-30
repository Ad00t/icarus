'use client'

import React from "react";
import ComponentBox from "@/components/component-box";
import { Typography } from "@mui/material";

export default function LastReading({ reading, posx, posy, width, height }) {
  return (
    <ComponentBox
      title="LAST READING"
      posx={posx} posy={posy}
      width={width} height={height}
    >
      {
        Object.keys(reading).map(key => (
          <Typography
            variant="p" 
            color="black" 
            paddingLeft="15px"
            key={key}
          >
            { `${key}: ${reading[key]}` }
            <br />
          </Typography>
        ))
      }
    </ComponentBox>
  );
}
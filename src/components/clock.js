'use client'

import { useState } from "react";
import ComponentBox from "@/components/component-box";
import Typography from "@mui/material/Typography"

export default function Clock({ posx, posy, width, height }) {
  const [ dateStr, setDateStr ] = useState("");

  setInterval(() => {
    setDateStr(new Date().toLocaleString("en-US"));
  }, 1000);

  return (
    <ComponentBox
      posx={posx} posy={posy}
      width={width} height={height}
    >
      <Typography 
        sx={{ fontWeight: 'bold' }}
        variant="h4" 
        align="center"
        padding="20px"
        color="black"
      >
        { dateStr }
      </Typography>
    </ComponentBox>
  );
}
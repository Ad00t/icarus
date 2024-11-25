'use client'

import { useState } from "react";
import Typography from "@mui/material/Typography"

export default function Clock() {
  const [ dateStr, setDateStr ] = useState("");

  setInterval(() => {
    setDateStr(new Date().toLocaleString("en-US"));
  }, 1000);

  return (
    <div>
      <Typography 
        variant="h3" 
        align="center"
        padding="20px"
      >
        { dateStr }
      </Typography>
    </div>
  );
}
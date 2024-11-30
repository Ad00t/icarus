'use client'

import { useState } from "react";
import ComponentBox from "@/components/component-box";
import Typography from "@mui/material/Typography"

export default function Clock() {
  const [ dateStr, setDateStr ] = useState("");

  setInterval(() => {
    setDateStr(new Date().toLocaleString("en-US"));
  }, 1000);

  return (
    <ComponentBox>
      <Typography 
        sx={{ fontWeight: 'bold' }}
        variant="h3" 
        align="center"
        padding="20px"
        color="black"
      >
        { dateStr }
      </Typography>
    </ComponentBox>
  );
}
'use client'

import ComponentBox from "@/components/component-box";
import { Button, Typography } from "@mui/material";

export default function SerialInterface({ isConnected, connect, disconnect, serialInfo, posx, posy, width, height }) {

  return (
    <ComponentBox
      title="SERIAL"
      posx={posx} posy={posy}
      width={width} height={height}
    >
      <Button
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}
        variant="contained"
        color={ isConnected ? "success" : "error" }
        onClick={ isConnected ? disconnect : connect }
      >
        { isConnected ? "Connected" : "Disconnected "}
      </Button>
      <Typography 
        sx={{ whiteSpace: 'pre-line' }}
        variant="p"
        align="center"
        color="black"
        paddingTop="20px"
      >
        { serialInfo }
      </Typography>
    </ComponentBox>
  );
}
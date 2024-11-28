import { Box, Button, Typography } from "@mui/material";

export default function SerialInterface({isConnected, connect, disconnect, posx, posy, width, height }) {

  return (
    <Box
      sx={{
        position: 'absolute',
        left: posx,
        top: posy,
        width: width,
        height: height,
        borderRadius: 2,
        bgcolor: '#222222',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography 
        variant="h6"
        align="center"
        color="white"
        padding="10px"
      >
        SERIAL INTERFACE
      </Typography>
      <Button
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        variant="contained"
        color={ isConnected ? "success" : "error" }
        onClick={ isConnected ? disconnect : connect }
      >
        { isConnected ? "Connected" : "Disconnected "}
      </Button>
    </Box>
  );
}
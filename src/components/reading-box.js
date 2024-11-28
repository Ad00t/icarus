'use client'

import { useState } from "react";
import { Box, Typography } from "@mui/material";

export default function ReadingBox({ title, reading, posx, posy, width, height }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: posx,
        top: posy,
        width: width,
        height: height,
        borderRadius: 2,
        bgcolor: '#222222'
      }}
    >
      <Typography 
        variant="h6"
        align="center"
        color="white"
        padding="10px"
      >
        { title }
      </Typography>
      {/* { 
        Object.keys(reading).map(key => (
          <Typography
            variant="p" 
            color="#CCCCCC" 
            paddingLeft="20px" 
            paddingTop="5px" 
            paddingBottom="5px"
            key={key}
          >
            { `${key}: ${reading[key]}`}
          </Typography>
        ))
      } */}
      <Typography
        variant="p" 
        color="#CCCCCC" 
        paddingLeft="20px" 
        paddingTop="5px" 
        paddingBottom="5px"
      >
        { reading }
      </Typography>
    </Box>
  );
}
'use client'

import { useRef, useEffect } from "react";
import ComponentBox from "@/components/component-box";
import { Typography, Grid2 } from "@mui/material";

export default function EventLog({ eventLog, posx, posy, width, height }) {
  const boxRef = useRef(null);
  const logLevelMap = {
    0: 'INFO',
    1: 'WARN',
    2: 'ERROR'
  }

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [ eventLog ]);

  return (
    <ComponentBox
      title="EVENT LOG"
      posx={posx} posy={posy}
      width={width} height={height}
      ref={boxRef}
    >
      <Grid2 container justifyContent="left" marginLeft="15px" marginBottom="10px">
        <Grid2 sx={12}>
          {
            eventLog.map((log, i) => 
              <Typography
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                variant="body1" 
                color="black"
                key={i}
              >
                { `T${(log.tx_ts/1000.0).toFixed(3)} -- ${logLevelMap[log.level]} -- ${log.desc}` }
                <br />
              </Typography>
            )
          }
        </Grid2>
      </Grid2>
    </ComponentBox>
  );
}
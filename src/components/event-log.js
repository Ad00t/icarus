import { useRef, useEffect } from "react";
import ComponentBox from "@/components/component-box";
import { Typography } from "@mui/material";

export default function Log({ eventLog, posx, posy, width, height }) {
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
      {
        eventLog.map((log, i) => 
          <Typography
            sx={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            variant="p" 
            color="black" 
            paddingLeft="15px"
            key={i}
          >
            { `${new Date(log.rx_ts).toTimeString().slice(0, 8)} -- ${logLevelMap[log.level]} -- ${log.desc}` }
            <br />
          </Typography>
        )
      }
    </ComponentBox>
  );
}
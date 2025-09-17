'use client'

import { useRef, useState } from "react";
import ComponentBox from "@/components/component-box";
import { Button, Grid2 } from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';

export default function Charts({ chartData, posx, posy, width, height }) {
  const boxRef = useRef(null);
  const [ chartConfigs, setChartConfigs ] = useState({
    "pps": { "visible": true },
    "rssi": { "visible": true },
    "alt": { "visible": true },
    "acc": { "visible": true },
    "vel": { "visible": true },
    "pos": { "visible": true } 
  });

  return (
    <ComponentBox
      posx={posx} posy={posy}
      width={width} height={height}
      ref={boxRef}
    >
      <Grid2 sx={{ marginTop: '10px' }} container justifyContent="center">
        <Grid2 container spacing={1}>
          <Button
            variant="contained"
            color={chartConfigs.pps.visible ? 'success' : 'error' }
            onClick={() => setChartConfigs({ ...chartConfigs, pps: { "visible": !chartConfigs.pps.visible } })}
          >
            PPS
          </Button>
          <Button
            variant="contained"
            color={chartConfigs.rssi.visible ? 'success' : 'error' }
            onClick={() => setChartConfigs({ ...chartConfigs, rssi: { "visible": !chartConfigs.rssi.visible } })}
          >
            RSSI
          </Button>
          <Button
            variant="contained"
            color={chartConfigs.alt.visible ? 'success' : 'error' }
            onClick={() => setChartConfigs({ ...chartConfigs, alt: { "visible": !chartConfigs.alt.visible } })}
          >
            ALT
          </Button>
          <Button
            variant="contained"
            color={chartConfigs.acc.visible ? 'success' : 'error' }
            onClick={() => setChartConfigs({ ...chartConfigs, acc: { "visible": !chartConfigs.acc.visible } })}
          >
            ACC
          </Button>
          <Button
            variant="contained"
            color={chartConfigs.vel.visible ? 'success' : 'error' }
            onClick={() => setChartConfigs({ ...chartConfigs, vel: { "visible": !chartConfigs.vel.visible } })}
          >
            VEL
          </Button>
          <Button
            variant="contained"
            color={chartConfigs.pos.visible ? 'success' : 'error' }
            onClick={() => setChartConfigs({ ...chartConfigs, pos: { "visible": !chartConfigs.pos.visible } })}
          >
            POS
          </Button>
        </Grid2>
        { chartConfigs.pps.visible && 
          <LineChart
            dataset={chartData.pps}
            xAxis={[{ dataKey: 'ts', label: 'Time (HH:MM:SS)', scaleType: 'point' }]}
            series={[{ dataKey: 'pps', label: 'Packet Rate (Hz)', showMark: false, color: '#0000FF', connectNulls: true }]}
            width={600}
            height={200}
            skipAnimation
          />
        }
        { chartConfigs.rssi.visible && 
          <LineChart
            dataset={chartData.rssi}
            xAxis={[{ dataKey: 'ts', label: 'Elapsed Time (s)' }]}
            series={[{ dataKey: 'rssi', label: 'RSSI (dBm)', showMark: false, color: '#FF0000', connectNulls: true }]}
            width={600}
            height={200}
            skipAnimation
          />
        }
        { chartConfigs.alt.visible && 
          <LineChart
            dataset={chartData.alt}
            xAxis={[{ dataKey: 'ts', label: 'Elapsed Time (s)' }]}
            series={[
              { dataKey: 'alt', label: 'Altitude (m)', showMark: false, connectNulls: true },
            ]}
            width={600}
            height={400}
            skipAnimation
          />
        }
        { chartConfigs.acc.visible && 
          <LineChart
            dataset={chartData.acc}
            xAxis={[{ dataKey: 'ts', label: 'Elapsed Time (s)' }]}
            series={[
              { dataKey: 'ax', label: 'AX (m/s^2)', showMark: false, connectNulls: true },
              { dataKey: 'ay', label: 'AY (m/s^2)', showMark: false, connectNulls: true },
              { dataKey: 'az', label: 'AZ (m/s^2)', showMark: false, connectNulls: true },
            ]}
            width={600}
            height={400}
            skipAnimation
          />
        }
        { chartConfigs.vel.visible && 
          <LineChart
            dataset={chartData.vel}
            xAxis={[{ dataKey: 'ts', label: 'Elapsed Time (s)' }]}
            series={[
              { dataKey: 'vx', label: 'VX (m/s)', showMark: false, connectNulls: true },
              { dataKey: 'vy', label: 'VY (m/s)', showMark: false, connectNulls: true },
              { dataKey: 'vz', label: 'VZ (m/s)', showMark: false, connectNulls: true },
            ]}
            width={600}
            height={400}
            skipAnimation
          />
        }
        { chartConfigs.pos.visible && 
          <LineChart
            dataset={chartData.pos}
            xAxis={[{ dataKey: 'ts', label: 'Elapsed Time (s)' }]}
            series={[
              { dataKey: 'px', label: 'PX (m)', showMark: false, connectNulls: true },
              { dataKey: 'py', label: 'PY (m)', showMark: false, connectNulls: true },
              { dataKey: 'pz', label: 'PZ (m)', showMark: false, connectNulls: true },
            ]}
            width={600}
            height={400}
            skipAnimation
          />
        }
      </Grid2>
    </ComponentBox>
  );
}
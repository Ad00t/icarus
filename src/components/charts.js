'use client'

import { useRef, useEffect, useState } from "react";
import ComponentBox from "@/components/component-box";
import { Button, Grid2 } from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';

export default function Charts({ chartData, posx, posy, width, height }) {
  const boxRef = useRef(null);
  const [ chartVis, setChartVis ] = useState({ 
    "packet": true,  
    "acc": true,
    "vel": true,
    "pos": true
  });

  const [packetChart, setPacketChart] = useState({
    dataset: chartData,
    xAxis: [{ data: [], label: 'Elapsed Time (s)' }],
    series: [
      { data: [], label: 'RSSI (dBm)', showMark: false, color: '#FF0000', connectNulls: true },
      { data: [], label: 'Packet Rate (Hz)', showMark: false, color: '#0000FF', connectNulls: true },
    ], 
    skipAnimation: true
  });

  const [accChart, setAccChart] = useState({
    dataset: chartData,
    xAxis: [{ data: [], label: 'Elapsed Time (s)' }],
    series: [
      { data: [], label: 'AX (m/s^2)', showMark: false },
      { data: [], label: 'AY (m/s^2)', showMark: false },
      { data: [], label: 'AZ (m/s^2)', showMark: false },
    ], 
    skipAnimation: true
  });

  const [velChart, setVelChart] = useState({
    dataset: chartData,
    xAxis: [{ data: [], label: 'Elapsed Time (s)' }],
    series: [
      { data: [], label: 'VX (m/s)', showMark: false },
      { data: [], label: 'VY (m/s)', showMark: false },
      { data: [], label: 'VZ (m/s)', showMark: false },
    ], 
    skipAnimation: true
  });

  const [posChart, setPosChart] = useState({
    dataset: chartData,
    xAxis: [{ data: [], label: 'Elapsed Time (s)' }],
    series: [
      { data: [], label: 'PX (m)', showMark: false },
      { data: [], label: 'PY (m)', showMark: false },
      { data: [], label: 'PZ (m)', showMark: false },
    ], 
    skipAnimation: true
  });

  const updateChartData = () => {
    setPacketChart({
      dataset: chartData,
      xAxis: [{ dataKey: 'ts', label: 'Elapsed Time (s)' }],
      series: [
        { dataKey: 'rssi', label: 'RSSI (dBm)', showMark: false, color: '#FF0000', connectNulls: true },
        { dataKey: 'pps', label: 'Packet Rate (Hz)', showMark: false, color: '#0000FF', connectNulls: true },
      ], 
      skipAnimation: true
    });
    setAccChart({
      dataset: chartData,
      xAxis: [{ dataKey: 'ts', label: 'Elapsed Time (s)' }],
      series: [
        { dataKey: 'ax', label: 'AX (m/s^2)', showMark: false },
        { dataKey: 'ay', label: 'AY (m/s^2)', showMark: false },
        { dataKey: 'az', label: 'AZ (m/s^2)', showMark: false },
      ], 
      skipAnimation: true
    });
    setVelChart({
      dataset: chartData,
      xAxis: [{ dataKey: 'ts', label: 'Elapsed Time (s)' }],
      series: [
        { dataKey: 'vx', label: 'VX (m/s)', showMark: false },
        { dataKey: 'vy', label: 'VY (m/s)', showMark: false },
        { dataKey: 'vz', label: 'VZ (m/s)', showMark: false },
      ], 
      skipAnimation: true
    });
    setPosChart({
      dataset: chartData,
      xAxis: [{ dataKey: 'ts', label: 'Elapsed Time (s)' }],
      series: [
        { dataKey: 'px', label: 'PX (m)', showMark: false },
        { dataKey: 'py', label: 'PY (m)', showMark: false },
        { dataKey: 'pz', label: 'PZ (m)', showMark: false },
      ], 
      skipAnimation: true
    });
  };

  useEffect(updateChartData, [ chartData ]);

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
            color={chartVis.packet ? 'success' : 'error' }
            onClick={() => setChartVis({ ...chartVis, packet: !chartVis.packet })}
          >
            PACKET
          </Button>
          <Button
            variant="contained"
            color={chartVis.acc ? 'success' : 'error' }
            onClick={() => setChartVis({ ...chartVis, acc: !chartVis.acc })}
          >
            ACC
          </Button>
          <Button
            variant="contained"
            color={chartVis.vel ? 'success' : 'error' }
            onClick={() => setChartVis({ ...chartVis, vel: !chartVis.vel })}
          >
            VEL
          </Button>
          <Button
            variant="contained"
            color={chartVis.pos ? 'success' : 'error' }
            onClick={() => setChartVis({ ...chartVis, pos: !chartVis.pos })}
          >
            POS
          </Button>
        </Grid2>
        { chartVis.packet && 
          <LineChart
            dataset={chartData}
            xAxis={packetChart.xAxis}
            series={packetChart.series}
            width={600}
            height={400}
            skipAnimation
          />
        }
        { chartVis.acc && 
          <LineChart
            dataset={chartData}
            xAxis={accChart.xAxis}
            series={accChart.series}
            width={600}
            height={400}
            skipAnimation
          />
        }
        { chartVis.vel && 
          <LineChart
            dataset={chartData}
            xAxis={velChart.xAxis}
            series={velChart.series}
            width={600}
            height={400}
            skipAnimation
          />
        }
        { chartVis.pos && 
          <LineChart
            dataset={chartData}
            xAxis={posChart.xAxis}
            series={posChart.series}
            width={600}
            height={400}
            skipAnimation
          />
        }
      </Grid2>
    </ComponentBox>
  );
}
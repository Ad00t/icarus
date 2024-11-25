'use client'

import { useState } from "react";
import Clock from "@/components/clock";
import ReadingBox from "@/components/reading-box";

export default function Home() {
  const [ lastReading, setLastReading ] = useState({ "a_x": 100 });

  return (
    <div>
      <Clock />
      <ReadingBox title="LAST READING" reading={lastReading} posx={100} posy={100} width={200} height={300} />
    </div>
  );
}


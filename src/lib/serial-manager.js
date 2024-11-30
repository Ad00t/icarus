class SerialManager {
  constructor(onPacketRecv, setIsConnected, setSerialInfo) {
    this.port = null;
    this.reader = null;
    this.onPacketRecv = onPacketRecv;
    this.setIsConnected = setIsConnected;
    this.setSerialInfo = setSerialInfo;
  }

  async connect(baudRate=115200) {
    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate });
      let portInfo = this.port.getInfo();
      let serialInfoStr = Object.keys(portInfo).map(key => `${key}: ${portInfo[key]}\n`);
      console.log("CONNECTED SERIAL");
      console.log(portInfo);
      this.startReading();
      this.setSerialInfo(serialInfoStr);
      this.setIsConnected(true);
    } catch (error) {
      console.error(error);
    }
  }

  async disconnect() {
    try {
      if (this.reader) {
        this.reader.cancel();
        await this.readableStreamClosed.catch(() => { /* Ignore the error */ });
      }

      if (this.port) {
        await this.port.close();
        console.log("PORT CLOSED");
      }

      this.setIsConnected(false);
      this.setSerialInfo("");
      console.log("DISCONNECTED SERIAL");
    } catch (error) {
      console.error(error);
    }
  }

  async startReading() {
    try {
      const textDecoder = new TextDecoderStream();
      this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
      this.reader = textDecoder.readable.getReader();

      let lineBuffer = "";
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) {
          this.reader.releaseLock();
          console.log("STREAM CLOSED, LOCK RELEASED");
          break;
        }
        lineBuffer += value;
        const lines = lineBuffer.split("\n");
        lineBuffer = lines.pop();
        for (const line of lines) {
          console.log(line);
          const pobj = this.interpretRxPacket(line);
          this.onPacketRecv(pobj);
        }
      }
    } catch (error) {
      if (error.name == "NetworkError") {
        await this.disconnect();
        alert("SERIAL DEVICE DISCONNECTED");
      }
      console.error(error);
    }
  }

  interpretRxPacket(pstr) {
    const pobj = {};
    const pstr_split = pstr.split(',');
    pobj["rssi"] = parseFloat(pstr_split[0]);
    pobj["ptype"] = parseInt(pstr_split[1][0]);
    pobj["src"] = parseInt(pstr_split[1][1]);
    pobj["dest"] = parseInt(pstr_split[1][2]);
    pobj["rx_ts"] = Date.now();
    switch(pobj["ptype"]) {
      case 0: // READING
        pobj["yaw"] = parseFloat(pstr_split[2]);
        pobj["pitch"] = parseFloat(pstr_split[3]);
        pobj["roll"] = parseFloat(pstr_split[4]);
        pobj["a_x"] = parseFloat(pstr_split[5]);
        pobj["a_y"] = parseFloat(pstr_split[6]);
        pobj["a_z"] = parseFloat(pstr_split[7]);
        pobj["temperature"] = parseFloat(pstr_split[8]);
        pobj["pressure"] = parseFloat(pstr_split[9]);
        pobj["altitude"] = parseFloat(pstr_split[10]);
        break;
      case 1: // LOG
        pobj["level"] = parseInt(pstr_split[2]);
        pobj["desc"] = pstr_split[3];
        break;
    }
    return pobj;
  }

  createCommandPacket() {

  }
}

export default SerialManager;
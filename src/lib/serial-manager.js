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
        const lines = lineBuffer.split("\n")
        lineBuffer = lines.pop();
        for (let line of lines) {
          line = line.replace('\r', '').replace('\n', '').trim();
          if (line) {
            let packets = line.split(';');
            console.log(packets);
            for (let packet of packets) {
              const pobj = this.interpretRxPacket(packet);
              if (pobj) this.onPacketRecv(pobj);
            }
          }
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
    try {
      const pobj = {};
      const pstr_split = pstr.split(',');
      let off = 0;
      if (parseFloat(pstr_split[0]) < 0) {
        pobj["rssi"] = parseFloat(pstr_split[0]);
        off = 1;
      } 
      pobj["ptype"] = parseInt(pstr_split[off][0]);
      pobj["src"] = parseInt(pstr_split[off][1]);
      pobj["dest"] = parseInt(pstr_split[off++][2]);
      pobj["ts"] = parseFloat(pstr_split[off++]);
      switch(pobj["ptype"]) {
        case 0: // READING
          pobj["gyro_cal"] = parseInt(pstr_split[off++]);
          pobj["lacc_cal"] = parseInt(pstr_split[off++]);
          pobj["qr"] = parseFloat(pstr_split[off++]);
          pobj["qi"] = parseFloat(pstr_split[off++]);
          pobj["qj"] = parseFloat(pstr_split[off++]);
          pobj["qk"] = parseFloat(pstr_split[off++]);
          pobj["lax"] = parseFloat(pstr_split[off++]);
          pobj["lay"] = parseFloat(pstr_split[off++]);
          pobj["laz"] = parseFloat(pstr_split[off++]);
          pobj["temperature"] = parseFloat(pstr_split[off++]);
          pobj["pressure"] = parseFloat(pstr_split[off++]);
          pobj["altitude"] = parseFloat(pstr_split[off++]);
          break;
        case 1: // LOG
          pobj["level"] = parseInt(pstr_split[off++]);
          pobj["desc"] = pstr_split[off++];
          break;
      }
      return pobj;
    } catch (e) {

    }
  }

  createCommandPacket() {

  }
}

export default SerialManager;
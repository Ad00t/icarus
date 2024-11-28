class SerialManager {
  constructor(onDataRecv, onConnect, onDisconnect) {
    this.port = null;
    this.reader = null;
    this.onDataRecv = onDataRecv;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
  }

  async connect(baudRate=9600) {
    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate });
      console.log(`CONNECTED SERIAL: ${JSON.stringify(this.port.getInfo())}`);
      this.startReading();
      this.onConnect();
    } catch (error) {
      console.error(error);
    }
  }

  async disconnect() {
    try {
      if (this.reader) {
        if (this.reader.locked) {
          await this.reader.cancel();
        }
        this.reader.releaseLock();
      }
      if (this.port) {
        await this.port.close();
      }
      console.log('DISCONNECTED SERIAL');
      this.onDisconnect();
    } catch (error) {
      console.error(error);
    }
  }

  async startReading() {
    try {
      const decoder = new TextDecoderStream();
      this.reader = this.port.readable.pipeThrough(decoder).getReader();

      while (true) {
        const { value, done } = await this.reader.read();
        if (done) {
          console.log('Stream closed');
          break;
        }
        if (value) {
          this.onDataRecv(value);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default SerialManager;
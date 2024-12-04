#include <Adafruit_BNO08x.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP3XX.h>
#include <SPI.h>
#include <RH_RF95.h>
#include <chrono>
#include <icp.h>

Adafruit_BNO08x bno;
sh2_SensorValue_t sensorValue;
#define SEALEVELPRESSURE_HPA (1015)
Adafruit_BMP3XX bmp;
RH_RF95 rf95(4, 3);
bool debug = false;

void transmit_packet(const packet_t& packet) {
  string pstr = packet.packetify();
  if (debug) Serial.println(String(pstr.c_str()));
  if (debug) Serial.print("Transmitting...   ");
  bool packet_valid = rf95.send((uint8_t*) pstr.c_str(), pstr.length() + 1);
  if (debug) Serial.print("Valid:");
  if (debug) Serial.print(packet_valid);
  // rf95.waitPacketSent();
  if (debug) Serial.println(" Done");
}

void set_reports() {
  transmit_packet(log_packet_t(INFO, "BNO085 SETTING REPORTS"));
  if (!bno.enableReport(SH2_LINEAR_ACCELERATION)) {
    transmit_packet(log_packet_t(ERROR, "BNO085 COULD NOT ENABLE SH2_LINEAR_ACCELERATION"));
  }
  if (!bno.enableReport(SH2_GYRO_INTEGRATED_RV)) {
    transmit_packet(log_packet_t(ERROR, "BNO085 COULD NOT ENABLE SH2_GYRO_INTEGRATED_RV"));
  }
}

void setup() {
  // Serial init
  if (debug) {
    Serial.begin(115200);
    while (!Serial) ;
  }

  // RFM95 init
  while (!rf95.init()) {
    if (debug) Serial.println("RF95 NOT FOUND");
    delay(1000);
  }
  while (!rf95.setFrequency(915)) {
    if (debug) Serial.println("RF95 SET FREQUENCY FAILED");
    delay(1000);
  }
  rf95.setTxPower(23, false);
  digitalWrite(2, LOW);
  delay(10);
  digitalWrite(2, HIGH);
  delay(10);

  // BNO085 init
  while (!bno.begin_I2C()) {
    transmit_packet(log_packet_t(ERROR, "BNO085 NOT FOUND"));
    delay(1000);
  }
  transmit_packet(log_packet_t(INFO, "BNO085 FOUND"));
  set_reports();

  // BMP390 init
  while (!bmp.begin_I2C()) {
    transmit_packet(log_packet_t(ERROR, "BMP390 NOT FOUND"));
    delay(1000);
  }
  transmit_packet(log_packet_t(INFO, "BMP390 FOUND"));
  bmp.setTemperatureOversampling(BMP3_OVERSAMPLING_8X);
  bmp.setPressureOversampling(BMP3_OVERSAMPLING_4X);
  bmp.setIIRFilterCoeff(BMP3_IIR_FILTER_COEFF_3);
  bmp.setOutputDataRate(BMP3_ODR_50_HZ);
}

reading_packet_t rp;

void loop() {
  if (bno.wasReset()) {
    transmit_packet(log_packet_t(INFO, "BNO085 RESET"));
    set_reports();
  }

  if (rf95.available()) {
    if (debug) Serial.println("RF95 MESSAGE AVAILABLE");
    uint8_t buf[RH_RF95_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(buf);
    if (rf95.recv(buf, &len)) {
      if (debug) {
        RH_RF95::printBuffer("RECV: ", buf, len);
        Serial.println((char*)buf);
        Serial.print("RSSI: ");
        Serial.println(rf95.lastRssi(), DEC);
      }
    }
  }

  // Serial.print("Battery voltage: ");
  // Serial.print(analogRead(A0) * (5.0 / 1023.0) * 2);
  // Serial.println("V");

  int i = 0;
  while (bno.getSensorEvent(&sensorValue) && i < 10) {
    switch (sensorValue.sensorId) {
      case SH2_LINEAR_ACCELERATION:
        rp.acc_cal = sensorValue.status;
        rp.ax = sensorValue.un.linearAcceleration.x;
        rp.ay = sensorValue.un.linearAcceleration.y;
        rp.az = sensorValue.un.linearAcceleration.z;
        break;
      case SH2_GYRO_INTEGRATED_RV:
        rp.gyro_cal = sensorValue.status;
        rp.qr = sensorValue.un.gyroIntegratedRV.real;
        rp.qi = sensorValue.un.gyroIntegratedRV.i;
        rp.qj = sensorValue.un.gyroIntegratedRV.j;
        rp.qk = sensorValue.un.gyroIntegratedRV.k;
        break;
    }
    i++;
  }

  if (bmp.performReading()) {
    rp.temperature = bmp.temperature;
    rp.pressure = bmp.pressure / 100.0;
    rp.altitude = bmp.readAltitude(SEALEVELPRESSURE_HPA);
  }

  transmit_packet(rp);
  delay(5);
}

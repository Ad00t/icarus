#include <SPI.h>
#include <RH_RF95.h>
#include <icp.h>

RH_RF95 rf95(4, 3);

void setup() {
  // Serial init
  Serial.begin(115200);
  while (!Serial) ;

  // RFM95 init
  while (!rf95.init()) {
    delay(1000);
  }
  rf95.setFrequency(915);
  rf95.setModemConfig(RH_RF95::Bw500Cr45Sf128);
  rf95.setTxPower(23, false);
  digitalWrite(2, LOW);
  delay(10);
  digitalWrite(2, HIGH);
  delay(10);
}

void loop() {
  if (rf95.available()) {
    uint8_t buf[RH_RF95_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(buf);
    if (rf95.recv(buf, &len)) {
      String rssi_pstr = String((to_string(rf95.lastRssi()) + "," + (char*)buf).c_str());
      Serial.println(rssi_pstr);
    }
  }
}

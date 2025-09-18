# Project Icarus

## Synopsis

The goal of this project was to give me an introduction into consumer aerospace, avionics hardware, circuitry, flight control, 3D printing, and long range communications. Mk. 1 features a fully-from-scratch model rocket, with a custom 3D printed nose cone, motor mount, and aft fins. It sports a 36” parachute for recovery and an Aerotech G80T-10 rocket motor, expected to carry it to an apogee of ~443 meters. The nose cone houses a compact arduino flight controller, which continuously polls an Adafruit BMP390 barometric altimeter and a BNO085 inertial measurement unit for altitude and orientation readings respectively. These readings are broadcast via a 915Mhz RFM9x LoRa transceiver to a similar transceiver unit on the ground, which is connected to my laptop via USB Serial. Through testing, the range of these transceivers exceeds 500 meters, which should be sufficient for this iteration of the project. Packets are transmitted via a custom Icarus Communication Protocol (ICP) that dictates how they are interpreted on both ends. I’ve also built a custom telemetry dashboard that I’m calling Houston using Next.js, a React framework. It reads packets from the ground control transceiver and calculates real-time attitude (position, velocity, acceleration, heading) from just accelerometer and gyroscope data. This attitude is displayed in a 3D graph with its origin at the launch site.

All onboard flight controller code can be found in the arduino folder. 
The ground control visualization dashboard can be found in the houston folder.

## Launch Notes (12/9/24)

The rocket immediately canted off to the side. I believe this is because of the launch rail. It was a last-minute makeshift and wasn’t tall enough, as the recommended length was 6-8 feet and mine was about 1 meter. I definitely will be obtaining a proper launch rail for Mk. 2. Furthermore, about 10 seconds in, ground control stopped receiving readings. My best guesses are either the rocket passing the cliff-side and the RF signal being obstructed, or the sudden acceleration/deceleration knocking the battery loose. To aid in recovery, I will be integrating a GPS module in Mk. 2 as well.

## Avionics Bay & Ground Control Transceiver

<img width="2532" height="1170" alt="IMG_3880" src="https://github.com/user-attachments/assets/ce25ef94-621b-4899-bfbd-db63976fd693" />

![IMG_3877](https://github.com/user-attachments/assets/34d84bf1-29a8-4268-b343-04b30edbc077)

## Ground Control Dashboard

This screen recording was captured at launch.

https://github.com/user-attachments/assets/0684ee6b-21b4-4d43-a303-94b68e746d67

## Finalized Assembly

![IMG_3890](https://github.com/user-attachments/assets/0fcfe3a2-674a-49ec-8303-3fa97f563ead)

## Liftoff

https://github.com/user-attachments/assets/fa1297a8-73c1-4d0e-8d8d-37a8642f6174

## Parts List

### Flight Computer

* 2x Amazon.com: Arduino UNO R4 WiFi [ABX00087] - Renesas RA4M1 / ESP32-S3 - Wi-Fi, Bluetooth, USB-C, CAN, DAC, OP AMP, Qwiic Connector, 12x8 LED Matrix : Electronics

* Amazon.com: 5pack 9v Battery Clip with 2.1mm X 5.5mm Male DC Plug for Arduino by Corpco : Electronics

* Amazon.com: Energizer 9V Batteries, 2 Count MAX Premium Alkaline 9 Volt : Electronics

* TUOFENG 22 awg Wire Solid Core Hookup Wires-6 Different Colored Breadboard Wires 30ft or 9m Each, 22 Gauge Electronic Wire PVC (OD: 1.60mm) Arduino Wire - Amazon.com

* 4PCS Breadboards Kit Include 2PCS 830 Point 2PCS 400 Point Solderless Breadboards for Proto Shield Distribution Connecting Blocks: Amazon.com: Industrial & Scientific

* 2x Adafruit RFM95W LoRa Radio Transceiver Breakout - 868 or 915 MHz [RadioFruit] : ID 3072 : Adafruit Industries, Unique & fun DIY electronics and kits

* Adafruit BMP390 - Precision Barometric Pressure and Altimeter [STEMMA QT / Qwiic] : ID 4816 : Adafruit Industries, Unique & fun DIY electronics and kits

* Adafruit 9-DOF Orientation IMU Fusion Breakout - BNO085 (BNO080) [STEMMA QT / Qwiic] : ID 4754 : Adafruit Industries, Unique & fun DIY electronics and kits

### Chassis

* 2x Amazon.com: uxcell Clear Rigid Acrylic Pipe 76mm(3") ID x 80mm OD x 305mm(12") Round Tube Tubing : Industrial & Scientific

* Amazon.com: 36-inch Ripstop Nylon Cloth Parachute for Water or Model Rocket : Arts, Crafts & Sewing

* Amazon.com: Estes 2274 Recovery Wadding : Arts, Crafts & Sewing

* 1010 One piece Delrin Railbutton (rail-buttons.com)

### Miscellaneous

* Amazon.com: MakerBeam 900x10x10mm Beam Clear anodised (Pack of 2) : Industrial & Scientific

#ifndef PACKET_H
#define PACKET_H

#include <string>
#include <vector>

using namespace std;

// Enumerations
enum packet_type { READING, LOG, COMMAND };
enum terminus { GC, FC };
enum log_level { INFO, WARN, ERROR };
enum command_code { RESET, CALIBRATE };

// Base Packet Class
class packet_t {
public:
    packet_type ptype;
    terminus src, dest;

    packet_t(packet_type ptype, terminus src, terminus dest);
    packet_t();

    virtual string data_packetify() const = 0;
    virtual string data_prettify() const = 0;

    string header_packetify() const;
    string header_prettify() const;

    string packetify() const;
    string prettify() const;
};

// Reading Packet Class
class reading_packet_t : public packet_t {
public:
    int gyro_cal, acc_cal;
    float qr, qi, qj, qk, ax, ay, az, temperature, pressure, altitude;

    reading_packet_t();

    string data_packetify() const override;
    string data_prettify() const override;
};

// Log Packet Class
class log_packet_t : public packet_t {
public:
    log_level level;
    string desc;

    log_packet_t(log_level level, const string& desc);

    string data_packetify() const override;
    string data_prettify() const override;
};

// Command Packet Class
class command_packet_t : public packet_t {
public:
    command_code code;
    vector<float> args;

    command_packet_t(command_code code, const string str);

    string data_packetify() const override;
    string data_prettify() const override;
};

#endif // PACKET_H

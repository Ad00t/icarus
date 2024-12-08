#include "icp.h"
#include <sstream>
#include <string>

string ftos(float f) {
    std::ostringstream stream;
    stream.precision(3);
    stream << std::fixed << f;
    return stream.str();
}

// Base Packet Class Implementation
packet_t::packet_t(packet_type ptype, terminus src, terminus dest)
    : ptype(ptype), src(src), dest(dest) {}

packet_t::packet_t() {}

void packet_t::set_ts(unsigned long t) const {
    ts = t;
}

string packet_t::header_packetify() const {
    return to_string(ptype) + to_string(src) + to_string(dest) + "," + to_string(ts);
}

string packet_t::header_prettify() const {
    return "type:" + to_string(ptype) + "   src:" + to_string(src) + "   dest:" + to_string(dest) + "   ts:" + to_string(ts);
}

string packet_t::packetify() const {
    return header_packetify() + "," + data_packetify();
}

string packet_t::prettify() const {
    return header_prettify() + "   " + data_prettify();
}

// Reading Packet Class Implementation
reading_packet_t::reading_packet_t()
    : packet_t(READING, FC, GC) {}

string reading_packet_t::data_packetify() const {
    return to_string(gyro_cal) + "," + to_string(lacc_cal) + "," +
           ftos(qr) + "," + ftos(qi) + "," + ftos(qj) + "," +  ftos(qk) + "," +
           ftos(lax) + "," + ftos(lay) + "," + ftos(laz) + "," +
           ftos(temperature) + "," + ftos(pressure) + "," + ftos(altitude);
}

string reading_packet_t::data_prettify() const {
    return "gyro_cal:" + to_string(gyro_cal) + "   lacc_cal:" + to_string(lacc_cal) + 
           "   qr:" + ftos(qr) + "   qi:" + ftos(qi) + "   qj:" + ftos(qj)  + "   qk:" + ftos(qk) +
           "   lax:" + ftos(lax) + "   lay" + ftos(lay) + "   laz:" + ftos(laz) +
           "   temperature:" + ftos(temperature) + "   pressure:" + ftos(pressure) +
           "   altitude:" + ftos(altitude);
}

// Log Packet Class Implementation
log_packet_t::log_packet_t(log_level level, const string& desc)
    : packet_t(LOG, FC, GC), level(level), desc(desc) {}

string log_packet_t::data_packetify() const {
    return to_string(level) + "," + desc;
}

string log_packet_t::data_prettify() const {
    return "level:" + to_string(level) + "   desc:" + desc;
}

// Command Packet Class Implementation
command_packet_t::command_packet_t(command_code code, const string str)
    : packet_t(COMMAND, FC, GC), code(code) {
    int i0 = 0;
    int i1 = 0;
    while ((i1 = str.substr(i0).find(',')) != string::npos) {
        args.push_back(stof(str.substr(i0, i1 - i0)));
        i0 = i1 + 1;
    }
    args.push_back(stof(str.substr(i0)));
}

string command_packet_t::data_packetify() const {
    string s;
    for (size_t i = 0; i < args.size(); i++) {
        s += ftos(args[i]);
        if (i < args.size() - 1) s += ",";
    }
    return s;
}

string command_packet_t::data_prettify() const {
    return "args:" + data_packetify();
}

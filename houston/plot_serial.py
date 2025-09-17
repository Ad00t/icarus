import serial
import matplotlib.pyplot as plt
import numpy as np
import time
import os, csv

# Configure the serial port
ser = serial.Serial('COM20', 115200)  # Adjust COM port as needed

# Variable names for labels (ensure these match your Arduino output order)
labels = ["qr", "qi", "qj", "qk", "lax", "lay", "laz", 
          "ax", "ay", "az", "gx", "gy", "gz", "mx", "my", "mz"]

# Initialize plot
plt.ion()
fig, ax = plt.subplots()
lines = [ax.plot([], [], label=label)[0] for label in labels]  # Create lines with labels

# Set up data storage
xdata = np.arange(100)  # Adjust for the desired buffer size
ydata = [np.zeros(100) for _ in range(len(labels))]

# Configure the plot
ax.set_title("Real-Time Sensor Data")
ax.set_xlabel("Time")
ax.set_ylabel("Values")
ax.legend(loc="upper left")  # Display the legend in the upper-left corner

try:
    while True:
        try:
          # Read data from serial port
          line = ser.readline().decode('utf-8').strip()  # Read from serial port
          data = line.split(",")  # Assuming comma-separated values

          # Ensure the data is complete
          if len(data) == len(labels):
              for i in range(len(labels)):
                  # Extract and update the value for each variable
                  ydata[i] = np.roll(ydata[i], -1)
                  ydata[i][-1] = float(data[i].split(":")[1])

              # Update each line
              for i, line in enumerate(lines):
                  line.set_data(xdata, ydata[i])

              # Update plot limits and refresh
              ax.relim()
              ax.autoscale_view()
              plt.pause(0.01)
        except Exception as e:
          print(e)
except KeyboardInterrupt:
    ser.close()
    plt.ioff()
    plt.show()

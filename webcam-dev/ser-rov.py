#!/usr/bin/env python

import time
import serial

ser = serial.Serial(
    port='/dev/ttyACM0',
    baudrate = 9600,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,
    timeout=10
)
counter=0
while counter < 1:
    print('d')
    ser.write('d')
    ser.write('D')
    time.sleep(1)
    counter += 1

ser.write('x')
ser.close()

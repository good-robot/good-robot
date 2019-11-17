#!/usr/bin/env python

import time
import serial

ser = serial.Serial(
    port='/dev/ttyUSB0',
    baudrate = 9600,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,
    timeout=10
)

ser.write('speed %d\r'%(25))
time.sleep(0.3)
ser.write('speed %d\r'%(0))
ser.close()

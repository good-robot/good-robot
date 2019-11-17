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
ser.write('steer 0\r')
counter=0
while counter < 2:
    angle = 90 * (counter % 2)
    print('steer %d'%(angle))
    ser.write('steer %d\r'%(angle))
    time.sleep(1)
    counter += 1

ser.write('steer 0\r')
ser.write('speed %d\r'%30)
time.sleep(1)
print('drive')
for i in range(20):
	print('speed %d\r'%(20 + i))
	ser.write('speed %d\r'%(20 + i))
	time.sleep(0.2)

ser.write('speed 0\r')
print('stop')
time.sleep(1)
ser.close()

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
counter=0
while counter < 10:
    angle = 90 * counter % 2
    ser.write('steer %d'%(angle))
    ser.write('steer %d\r'%(angle))
    time.sleep(1)
    counter += 1
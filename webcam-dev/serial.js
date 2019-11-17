var steerRobot = function(angle){}
var speedRobot = function(angle){}
var stopRobot = function(){};

if(process.env.PI === "true"){
	console.log('starting up raspi serial.. ')
  const raspi = require('raspi');
  const Serial = require('raspi-serial').Serial;
  try {
	raspi.init(() => {
		console.log('connecting to serial port');
		var serial = new Serial({portId:"/dev/ttyUSB0", baudrate: 9600});
		serial.open(() => {
			console.log('successfully opened serial port!');
			stopRobot = function() {
				console.log('SER: speed ' + 0 + '\r');
				serial.write('speed ' + 0 + '\r');
			}
			steerRobot = function(angle) {
				console.log('SER: steer ' + clamp_value(angle, -90, 90) + '\r');
				serial.write('steer ' + clamp_value(angle, -90, 90) + '\r');
			}
			speedRobot = function(angle) {
				console.log('SER: speed ' + clamp_value(angle, -90, 90) + '\r');
				serial.write('speed ' + clamp_value(angle, -90, 90) + '\r');
			}
		});	  });
  } catch (error) {
	  console.log("ERROR connecting to serial port!");
	  console.log(error);
  }
}

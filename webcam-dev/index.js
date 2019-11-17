//operating system library. Used to get local IP address
var os = require("os");
//file system library. Used to load file stored inside back end server (https://nodejs.org/api/fs.html)
var fs = require("fs");
//http system library. Handles basic html requests
var http = require("http").createServer(http_handler);
//url library. Used to process html url requests
var url = require("url");
//Websocket
var io = require("socket.io")(http);
//Websocket used to stream video
var websocket = require("ws");

//-----------------------------------------------------------------------------------
//	CONFIGURATION
//-----------------------------------------------------------------------------------

//Port the server will listen to
var server_port = 8080;
var websocket_stream_port = 8082;
//Path of the http and css files for the http server
var file_index_name = "index.html";
var file_css_name = "style.css";
var file_jsplayer_name = "jsmpeg.min.js";
var file_main_name = "main.js";
//Http and css files loaded into memory for fast access
var file_index;
var file_css;
var file_jsplayer;
var file_main;
//Name of the local video stream
var stream_name = "mystream";

//-----------------------------------------------------------------------------------
//	SET UP SERIAL
//-----------------------------------------------------------------------------------

const ROBOT_ROVER = 'rover'
const ROBOT_GOOD = 'good'

console.log('ENV: ', process.env.PI);
process.env.PI = process.env.PI || false;


const ROBOT = process.env.ROBOT || ROBOT_GOOD; 
let SERIAL_ID

if (ROBOT == ROBOT_GOOD) SERIAL_ID = "/dev/ttyUSB0"
else if (ROBOT == ROBOT_ROVER) SERIAL_ID = "/dev/ttyACM0"

console.log("Have fun driving the " + ROBOT + " robot!");

var steerRobot = function(angle){}
var speedRobot = function(angle){}
var stopRobot = function(){};


if(process.env.PI === "true"){
	console.log('starting up raspi serial.. ')
  const raspi = require('raspi');
  const Serial = require('raspi-serial').Serial;
  try {
	raspi.init(() => {
		console.log('connecting to serial port: ' + SERIAL_ID);
		var serial = new Serial({portId: SERIAL_ID, baudrate: 9600});
		serial.open(() => {
			console.log('successfully opened serial port to ' + ROBOT);
			stopRobot = function() {
				if (ROBOT == ROBOT_GOOD) {
					console.log('SER: speed ' + 0 + '\r');
					serial.write('speed ' + 0 + '\r');
				}
				else if (ROBOT == ROBOT_ROVER) {
					console.log('SER: x');
					serial.write('x')
				}
			}
			steerRobot = function(angle) {
				if (ROBOT == ROBOT_GOOD) {
					console.log('SER: steer ' + clamp_value(angle, -90, 90) + '\r');
					serial.write('steer ' + clamp_value(angle, -90, 90) + '\r');
				}
				else if (ROBOT == ROBOT_ROVER) {
					if (angle < 0) {
						console.log('SER: a');
						serial.write('a')
					} else if (angle > 0) {
						console.log('SER: d');
						serial.write('d')
					}
				}
			}
			speedRobot = function(angle) {
				if (ROBOT == ROBOT_GOOD) {
					console.log('SER: speed ' + clamp_value(angle, -90, 90) + '\r');
					serial.write('speed ' + clamp_value(angle, -90, 90) + '\r');
				}
				else if (ROBOT == ROBOT_ROVER) {
					if (angle < 0) {
						console.log('SER: w');
						serial.write('s')
					} else if (angle > 0) {
						console.log('SER: s');
						serial.write('w')
					}
				}
			}
		});
	  });
  } catch (error) {
	  console.log("ERROR connecting to serial port!");
	  console.log(error);
  }
}

console.log(speedRobot);

//-----------------------------------------------------------------------------------
//	DETECT SERVER OWN IP
//-----------------------------------------------------------------------------------

//If just one interface, store the server IP Here
var server_ip;
//Get local IP address of the server
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach
(
	function (ifname)
	{
		var alias = 0;

		ifaces[ifname].forEach
		(
			function (iface)
			{
				if ('IPv4' !== iface.family || iface.internal !== false)
				{
				  // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				  return;
				}

				if (alias >= 1)
				{
					// this single interface has multiple ipv4 addresses
					console.log('INFO: Server interface ' +alias +' - ' + ifname + ':' + alias, iface.address);
				}
				else
				{
					server_ip = iface.address;
					// this interface has only one ipv4 adress
					console.log('INFO: Server interface - ' +ifname, iface.address);
				}
				++alias;
			}
		);
	}
);

//-----------------------------------------------------------------------------------
//	HTTP SERVER
//-----------------------------------------------------------------------------------
//	Fetch and serves local files to client

//Create http server and listen to the given port
http.listen
(
	server_port,
	function( )
	{
		console.log('INFO: ' +server_ip +' listening to html requests on port ' +server_port);
		//Pre-load http, css and js files into memory to improve http request latency
		file_index = load_file( file_index_name );
		file_css = load_file( file_css_name );
		file_jsplayer = load_file( file_jsplayer_name );
		file_main = load_file( file_main_name );
	}
);

//-----------------------------------------------------------------------------------
//	HTTP REQUESTS HANDLER
//-----------------------------------------------------------------------------------
//	Answer to client http requests. Serve http, css and js files

function http_handler(req, res)
{
	//If client asks for root
	if (req.url == '/')
	{
		//Request main page
		res.writeHead( 200, {"Content-Type": detect_content(file_index_name),"Content-Length":file_index.length} );
		res.write(file_index);
		res.end();

		console.log("INFO: Serving file: " +req.url);
	}
	//If client asks for css file
	else if (req.url == ("/" +file_css_name))
	{
		//Request main page
		res.writeHead( 200, {"Content-Type": detect_content(file_css_name),"Content-Length" :file_css.length} );
		res.write(file_css);
		res.end();

		console.log("INFO: Serving file: " +req.url);
	}
	//If client asks for css file
	else if (req.url == ("/" +file_jsplayer_name))
	{
		//Request main page
		res.writeHead( 200, {"Content-Type": detect_content(file_jsplayer_name),"Content-Length" :file_jsplayer.length} );
		res.write(file_jsplayer);
		res.end();

		console.log("INFO: Serving file: " +req.url);
	}
	else if (req.url == ("/" +file_main_name))
	{
		//Request main page
		res.writeHead( 200, {"Content-Type": detect_content('main.js'),"Content-Length" :file_main.length} );
		res.write(file_main);
		res.end();

		console.log("INFO: Serving file: " +req.url);
	}
	//Listening to the port the stream from ffmpeg will flow into
	else if (req.url = "/mystream")
	{
		res.connection.setTimeout(0);

		console.log( "Stream Connected: " +req.socket.remoteAddress + ":" +req.socket.remotePort );

		req.on
		(
			"data",
			function(data)
			{
				streaming_websocket.broadcast(data);
			}
		);

		req.on
		(
			"end",
			function()
			{
				console.log("local stream has ended");
				if (req.socket.recording)
				{
					req.socket.recording.close();
				}
			}
		);

	}
	//If client asks for an unhandled path
	else
	{
		res.end();
		console.log("ERR: Invalid file request" +req.url);
	}
}

//-----------------------------------------------------------------------------------
//	WEBSOCKET SERVER: CONTROL/FEEDBACK REQUESTS
//-----------------------------------------------------------------------------------
//	Handle websocket connection to the client

io.on
(
	"connection",
	function (socket)
	{
		console.log("connecting...");

		socket.emit("welcome", { payload: "Server says hello" });

		//Periodically send the current server time to the client in string form
		setInterval
		(
			function()
			{
				socket.emit("server_time", { server_time: get_server_time() });
			},
			//Send every 333ms
			333
		);

		socket.on
		(
			"myclick",
			function (data)
			{
				timestamp_ms = get_timestamp_ms();
				socket.emit("profile_ping", { timestamp: timestamp_ms });
				console.log("button event: " +" client says: " +data.payload);
			}
		);

		//////////////////
		// ROBOT STEERING INTERFACE
		//////////////////
		socket.on
		(
			"steering",
			function (data)
			{
				console.log('steer ' + data.payload);
				const steeringAngle = clamp_value(data.payload, -90, 90);
				steerRobot(steeringAngle);
			}
		);
		socket.on
		(
			"speed",
			function (data)
			{
				const speedAngle = clamp_value(data.payload, -90, 90);
				speedRobot(speedAngle);
			}
		);
		socket.on
		(
			"stop",
			function (data)
			{
				console.log("STOP!");
				stopRobot();
			}
		);
		// socket.on
		// (
		// 	"keyboard",
		// 	function (data)
		// 	{
		// 		timestamp_ms = get_timestamp_ms();
		// 		socket.emit("profile_ping", { timestamp: timestamp_ms });
		// 		console.log("keyboard event: " +" client says: " +data.payload);
		// 	}
		// );

		//profile packets from the client are answer that allows to compute roundway trip time
		// socket.on
		// (
		// 	"profile_pong",
		// 	function (data)
		// 	{
		// 		timestamp_ms_pong = get_timestamp_ms();
		// 		timestamp_ms_ping = data.timestamp;
		// 		console.log("Pong received. Round trip time[ms]: " +(timestamp_ms_pong -timestamp_ms_ping));
		// 	}
		// );
	}
);

//-----------------------------------------------------------------------------------
//	WEBSOCKET SERVER: STREAMING VIDEO
//-----------------------------------------------------------------------------------

// Websocket Server
var streaming_websocket = new websocket.Server({port: websocket_stream_port, perMessageDeflate: false});

streaming_websocket.connectionCount = 0;

streaming_websocket.on
(
	"connection",
	function(socket, upgradeReq)
	{
		streaming_websocket.connectionCount++;
		console.log
		(
			'New websocket Connection: ',
			(upgradeReq || socket.upgradeReq).socket.remoteAddress,
			(upgradeReq || socket.upgradeReq).headers['user-agent'],
			'('+streaming_websocket.connectionCount+" total)"
		);

		socket.on
		(
			'close',
			function(code, message)
			{
				streaming_websocket.connectionCount--;
				console.log('Disconnected websocket ('+streaming_websocket.connectionCount+' total)');
			}
		);
	}
);

streaming_websocket.broadcast = function(data)
{
	streaming_websocket.clients.forEach
	(
		function each(client)
		{
			if (client.readyState === websocket.OPEN)
			{
				client.send(data);
			}
		}
	);
};


//-----------------------------------------------------------------------------------
//	FUNCTIONS
//-----------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------
//	SERVER DATE&TIME
//-----------------------------------------------------------------------------------
//	Get server time in string form

function get_server_time()
{
	my_date = new Date();

	return my_date.toUTCString();
}

//-----------------------------------------------------------------------------------
//	TIMESTAMP
//-----------------------------------------------------------------------------------
//	Profile performance in ms

function get_timestamp_ms()
{
	my_date = new Date();
	return 1000.0* my_date.getSeconds() +my_date.getMilliseconds()
}

//-----------------------------------------------------------------------------------
//	FILE LOADER
//-----------------------------------------------------------------------------------
//	Load files into memory for improved latency

function load_file( file_name )
{
	var file_tmp;
	var file_path =  __dirname +"/" +file_name;

	//HTML index file
	try
	{
		file_tmp = fs.readFileSync( file_path );
	}
	catch (err)
	{
		console.log("ERR: " +err.code +" failed to load: " +file_path);
		throw err;
	}

	console.log("INFO: " +file_path +" has been loaded into memory");

	return file_tmp;
}

//-----------------------------------------------------------------------------------
//	CONTENT TYPE DETECTOR
//-----------------------------------------------------------------------------------
//	Return the right content type to give correct information to the client browser

function detect_content( file_name )
{
	if (file_name.includes(".html"))
	{
        return "text/html";
	}
	else if (file_name.includes(".css"))
	{
		return "text/css";
	}
	else if (file_name.includes(".js"))
	{
		return "application/javascript";
	}
	else
	{
		throw "invalid extension";
	}
}

function clamp_value(value, min, max)
{
	if (value > max) return max;
	if (value < min) return min;
	return value;
}

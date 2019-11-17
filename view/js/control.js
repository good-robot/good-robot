var wss = null

//TODO these are hardcoded in janus.js, change that
if(window.location.protocol === 'http:') {
	//server = "http://" + window.location.hostname + ":8088/janus";
	wss = "ws://" + window.location.hostname + "/ws";
} else {
	//server = "https://" + window.location.hostname + ":8089/janus";
	wss = "wss://" + window.location.hostname + "/ws";
}

var mysocket;

function control_connect() {

	console.log('Ben is the best');
	//socket.io
	mysocket = io('https://goodrobot.live', {
	  path: '/ws'
	});

	//mysocket = io.connect(wss);

	//Long lived frame object
	var last_frame;

	//-----------------------------------------
	//	CONNESSION ACKNOWLEDGE
	//-----------------------------------------
	//	Link is initiated by the client
	//	Server sends a welcome message when link is estabilished
	//	Server could send an auth token to keep track of individual clients and login data

	mysocket.on
	(
		'connection',
		(socket) => 
		{
			console.log('connected to websocket server');
	  		socket.send('user');
		}
	)

	mysocket.on
	(
		"welcome",
		(message) =>
		{
			console.log("Server websocket connession acknoweldged... " +message.payload);
		}
	)

	//-----------------------------------------
	//	SERVER->CLIENT CONTROLS
	//-----------------------------------------
	//	Server can send an async message to dinamically update the page without reloading
	//	This is an example message with the server local date and time in string form

	mysocket.on
	(
		"server_time",
		(message) =>
		{
			// fill_label( message.server_time );
			console.log("Server sent his local time... " +message.server_time);
		}
	)


	//-----------------------------------------
	//	CLIENT->SERVER CONTROLS
	//-----------------------------------------
	//	Controls inside the webpage can emit async events to the server
	//	In this example I have a push button and I catch keyboard strokes

	/////////
	// LISTENERS FOR STEERING AND SPEED
	////////
	function socket_steering_handler(steeringAngle)
	{
		// steeringAngle must be in [-90, 90]
		mysocket.emit("steering", { payload: steeringAngle });
		console.log("Steering angle ", steeringAngle);
	}
	function socket_speed_handler(speedAngle)
	{
		// steeringAngle must be in [-90, 90]
		mysocket.emit("speed", { payload: speedAngle });
		console.log("Speed angle ", speedAngle);
	}

	/////////
	// LISTENERS FOR KEYSTROKE STEERING, SPEED AND STOP
	////////
	window.document.addEventListener
	(
		"keypress",
		function onEvent(event)
		{
			switch (event.key) {
			case ' ':
				mysocket.emit("stop");
				break;
			case 'w':
				mysocket.emit("speed", { payload: 45 });
				break;
			case 's':
				mysocket.emit("speed", { payload: -45 });
				break;
			case 'a':
				mysocket.emit("steering", { payload: -90 });
				break;
			case 'd':
				mysocket.emit("steering", { payload: 90 });
				break;
			default:
				console.log('Sorry, use WASD to move and SPACE to stop.');
			}
			//Inform the server that a key has been pressed
			// mysocket.emit("keyboard", { payload: event.key });
			console.log("Key press..." + event.key);
		}
	);


} 

var wss = null

//TODO these are hardcoded in janus.js, change that
if(window.location.protocol === 'http:') {
	//server = "http://" + window.location.hostname + ":8088/janus";
	wss = "ws://" + window.location.hostname + "/ws";
} else {
	//server = "https://" + window.location.hostname + ":8089/janus";
	wss = "wss://" + window.location.hostname + "/ws";
}

function control_connect()
{
	//ben move this
	var webSocket = new WebSocket(wss);
	webSocket.onopen = function (event) {
		console.log('Websocket opened!')
		sendUser(webSocket, user);
		//log keypresses
		bindTouchKeys(webSocket);
	};

	webSocket.onmessage = function(data) {
		//
		console.log('Received a message!' + data)
	}

	webSocket.onclose = function(e) {
		//remove keypress listeners
		unbindTouchKeys();
		console.log('Socket is closed. Reconnecting..', e.reason);
	    setTimeout(function() {
	      control_connect();
	    }, 100);
	}

	webSocket.onerror = function(err) {
		console.log('Socket encountered error: ', err.message, 'Closing socket');
		webSocket.close();
	};
}

var userSent = false;
function sendUser(webSocket, username) {
	if(!userSent) {
		userSent = true;
		json = JSON.stringify({event:"userConnected", user:username})
		webSocket.send(json)
	}
}

function sendKey(keyDown, key, webSocket) {
	json = JSON.stringify({event: keyDown ? 'keyDown' : 'keyUp', key: key})
	webSocket.send(json);
}

var socket_steering_handler = function (steeringAngle){};
var socket_speed_handler = function (speedAngle){};

function unbindTouchKeys() {
	console.log('unbinding key events')
	$(document).unbind('keyup');
	$(document).unbind('keydown');
	$('#w').on('touchstart', function(){
		
	})
	$('#w').on('touchend', function(){
		
	})

	$('#a').on('touchstart', function(){
		
	})
	$('#a').on('touchend', function(){
		
	})

	$('#s').on('touchstart', function(){
		
	})
	$('#s').on('touchend', function(){

	})

	$('#d').on('touchstart', function(){

	})
	$('#d').on('touchend', function(){

	})

	socket_steering_handler = function (steeringAngle) {};
	socket_speed_handler = function (speedAngle){};
}

function bindTouchKeys(webSocket) {
	console.log('binding key events')

	/////////
	// LISTENERS FOR STEERING AND SPEED
	////////
	socket_steering_handler = function (steeringAngle)
	{
		// steeringAngle must be in [-90, 90]
		json = JSON.stringify({event: "steer", angle: steeringAngle})
		webSocket.send(json);
		console.log("Steering angle ", steeringAngle);
	}
	socket_speed_handler = function (speedAngle)
	{
		// steeringAngle must be in [-90, 90]
		json = JSON.stringify({event: "speed", angle: speedAngle})
		webSocket.send(json);
		console.log("Speed angle ", speedAngle);
	}

	// $(document).keyup(function(e) {
	// 	sendKey(false, e.key, webSocket)
	// });

	// $(document).keydown(function(e) {
	// 	sendKey(true, e.key, webSocket)
	// });
	// //shims to allow clicks of arrow icons to trigger key events
	// $('#w').on('touchstart', function(){
	// 	sendKey(true, 'w', webSocket)
	// })
	// $('#w').on('touchend', function(){
	// 	sendKey(false, 'w', webSocket)
	// })

	// $('#a').on('touchstart', function(){
	// 	sendKey(true, 'a', webSocket)
	// })
	// $('#a').on('touchend', function(){
	// 	sendKey(false, 'a', webSocket)
	// })

	// $('#s').on('touchstart', function(){
	// 	sendKey(true, 's', webSocket)
	// })
	// $('#s').on('touchend', function(){
	// 	sendKey(false, 's', webSocket)
	// })

	// $('#d').on('touchstart', function(){
	// 	sendKey(true, 'd', webSocket)
	// })
	// $('#d').on('touchend', function(){
	// 	sendKey(false, 'd', webSocket)
	// })
}


// function control_connect() {

// 	console.log('Ben is the best');
// 	//socket.io
// 	//mysocket = io('https://goodrobot.live', {
// 	//  path: '/ws'
// 	//});

// 	//mysocket = io.connect('http://goodrobot.live:3000');

// 	//Long lived frame object
// 	var last_frame;

// 	//-----------------------------------------
// 	//	CONNESSION ACKNOWLEDGE
// 	//-----------------------------------------
// 	//	Link is initiated by the client
// 	//	Server sends a welcome message when link is estabilished
// 	//	Server could send an auth token to keep track of individual clients and login data

// 	mysocket.on
// 	(
// 		'connection',
// 		(socket) => 
// 		{
// 			console.log('connected to websocket server');
// 	  		socket.send('user');
// 	  		socket.emit('new user', "user")
// 		}
// 	)

// 	mysocket.on
// 	(
// 		"welcome",
// 		(message) =>
// 		{
// 			console.log("Server websocket connession acknoweldged... " +message.payload);
// 		}
// 	)

// 	//-----------------------------------------
// 	//	SERVER->CLIENT CONTROLS
// 	//-----------------------------------------
// 	//	Server can send an async message to dinamically update the page without reloading
// 	//	This is an example message with the server local date and time in string form

// 	mysocket.on
// 	(
// 		"server_time",
// 		(message) =>
// 		{
// 			// fill_label( message.server_time );
// 			console.log("Server sent his local time... " +message.server_time);
// 		}
// 	)


// 	//-----------------------------------------
// 	//	CLIENT->SERVER CONTROLS
// 	//-----------------------------------------
// 	//	Controls inside the webpage can emit async events to the server
// 	//	In this example I have a push button and I catch keyboard strokes

// 	/////////
// 	// LISTENERS FOR STEERING AND SPEED
// 	////////
// 	function socket_steering_handler(steeringAngle)
// 	{
// 		// steeringAngle must be in [-90, 90]
// 		mysocket.emit("steering", { payload: steeringAngle });
// 		console.log("Steering angle ", steeringAngle);
// 	}
// 	function socket_speed_handler(speedAngle)
// 	{
// 		// steeringAngle must be in [-90, 90]
// 		mysocket.emit("speed", { payload: speedAngle });
// 		console.log("Speed angle ", speedAngle);
// 	}

// 	/////////
// 	// LISTENERS FOR KEYSTROKE STEERING, SPEED AND STOP
// 	////////
// 	window.document.addEventListener
// 	(
// 		"keypress",
// 		function onEvent(event)
// 		{
// 			switch (event.key) {
// 			case ' ':
// 				mysocket.emit("stop");
// 				break;
// 			case 'w':
// 				mysocket.emit("speed", { payload: 45 });
// 				break;
// 			case 's':
// 				mysocket.emit("speed", { payload: -45 });
// 				break;
// 			case 'a':
// 				mysocket.emit("steering", { payload: -90 });
// 				break;
// 			case 'd':
// 				mysocket.emit("steering", { payload: 90 });
// 				break;
// 			default:
// 				console.log('Sorry, use WASD to move and SPACE to stop.');
// 			}
// 			//Inform the server that a key has been pressed
// 			// mysocket.emit("keyboard", { payload: event.key });
// 			console.log("Key press..." + event.key);
// 		}
// 	);


// } 

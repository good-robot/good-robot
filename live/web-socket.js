// var host_ip = document.location.hostname;
var host_ip = '10.84.114.40';
console.log("connecting to host: ", host_ip);

//Get references to the html controls
textbox_input1 = window.document.getElementById("my_text_box")

steering_input = window.document.getElementById("steering")

//Connect to the server via websocket
var mysocket = io("http://" +host_ip +":8080");
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
        fill_label( message.server_time );
        console.log("Server sent his local time... " +message.server_time);
    }
)

function fill_label( payload )
{
    // textbox_input1.value=payload;
    console.log('lol')
}

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
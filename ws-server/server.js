//main server entry point. nginx handles https and reverse proxies requests
//http on port 3000
//ws on port 3001

userLog = 'userlog.txt'

const server = require('http').createServer();

const io = require('socket.io')(server, {
  path: '/ws',
  serveClient: false,
});

//listen for http
const http_port = process.env.HTTP_PORT || 3000
server.listen(http_port, () =>
  console.log('Listening on port ' + http_port),
);

//listen for ws
const fs = require('fs');

//date stuff
// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

//echo any ws to all clients
io.on('connection', function (socket) {
  console.log('connection');
  socket.send('welcome');
  socket.on('message', function (e) {
    //broadcast message
    console.log('received: ' + e)
    socket.emit(e)
    d = JSON.parse(e)
    if(d.event === "userConnected"){
      console.log('writing user to userLog: ', d.user)
      var newDate = new Date();
      var datetime = newDate.today() + " @ " + newDate.timeNow();
      fs.appendFile(userLog, datetime + ' ' + d.user + '\n', function (err) {
        if(err) console.log(err);
      });
    }
  });
});

io.on('message', function (msg) {
  console.log('got a message!');
})

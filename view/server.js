//main server entry point. nginx handles https and reverse proxies requests
//http on port 3000
//ws on port 3001

userLog = 'userlog.txt'

const WebSocket = require('ws');
const express =  require('express')
const app = express()
var path = require('path');

//serve static stuff from public folder
//app.use(express.static('public'))

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//listen for http
const http_port = process.env.HTTP_PORT || 3000
app.listen(http_port, () =>
  console.log('Listening on port ' + http_port),
);

//listen for ws
const fs = require('fs');
const ws_port = process.env.WS_PORT || 3001
const wss = new WebSocket.Server({ port: ws_port });

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
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(e) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(e);
      }
    });
    console.log('received: ' + e)
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
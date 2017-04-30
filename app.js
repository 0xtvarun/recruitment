var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var ipaddr = [];

server.listen(3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

	//Push the IP address into the array
	//TODO: verify if the IP exists
	ipaddr.push(socket.handshake.address);
	
	//emit the ip address to the client
	//TODO: if new IP broadcast to all active sockets
	socket.emit('array', { array: ipaddr });
	
	//remove IP from the global IP array
	//TODO: broadcast the IP address to be removed
	socket.on('disconnect', function(){
		console.log("disconnect");
	})
});


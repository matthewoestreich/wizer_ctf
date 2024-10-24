var express = require('express');
var escape = require('escape-html');
var serialize = require('node-serialize');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

app.post('/getMyProfile', function(req, res) {
    // For the purpose of this challenge, we are going to return a static base64 encoded JSON object
	res.send({ "profile":  "eyAibmFtZSI6ICJIYWNrZXIgSnVuaW9yIiB9"});
});

app.post('/getMyName', function(req, res) {
		//console.log(req.body)
    let response = "";

	if (req.body.profile) {
		console.log("before buffer")
		var buffer = new Buffer(req.body.profile, 'base64').toString();
		console.log("after buffer\n")
		console.log("before unserialize")
		var json = serialize.unserialize(buffer);
		console.log("after unserialize\n")
		//console.log({json});
		if (json.name) {
			response = `${escape(json.name)}`;
			console.log(`sending response`,json, response)
		}
	} else {
		response = "No profile provided";
	}
	res.send(response);
});
app.listen(3000);
console.log("Listening on port 3000");
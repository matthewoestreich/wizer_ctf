const express = require("express");
var bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
app.use(bodyParser.json());

function createObjects(objects) {
	// code to save the custom object in the database
}
function createExclusiveObjects(objects) {
	// code to save the exclusive object in the database
}

app.post("/api/createObjects", async function (req, res) {
	let objectsRetrieved = req.body;
	const objectsToBeCreated = [];
	let objectCount = 0;
	let exclusiveObjectCount = 0;
	let exclusiveUnapprovedObjectCount = 0;

	try {
		for (const object of objectsRetrieved) {
			if (object.type === "exclusive") {
				if (object.exclusivePasscode === process.env.EXCLUSIVE_PASSCODE) {
					objectsToBeCreated.push(Object.assign({ approved: true }, object));
				} else {
					res.send("Invalid passcode");
					return;
				}
			} else {
				objectsToBeCreated.push(Object.assign({ approved: false }, object));
			}
		}
		for (const object of objectsToBeCreated) {
			if (object.type === "exclusive" && object.approved) {
				exclusiveObjectCount++;
				createExclusiveObjects(object);
			} else if (object.type === "exclusive") {
				exclusiveUnapprovedObjectCount++;
			} else {
				objectCount++;
				createObjects(object);
			}
		}

		res.send(`Successfully created ${exclusiveObjectCount} exclusive objects,` + `${exclusiveUnapprovedObjectCount} exclusive objects pending approval and ` + `${objectCount} standard objects`);
	} catch (e) {
		res.send(e.message);
	}
});

app.listen(process.env.PORT, () => {
	console.log("Running at Port", process.env.PORT);
});

module.exports = app;

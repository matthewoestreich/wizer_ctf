import express from "express";
const app = express();
const app2 = express();
import bodyParser from "body-parser";
app.use(bodyParser.json());
app2.use(bodyParser.json());
import dotenv from "dotenv";
import { CRMEntities } from "./crm.mjs";
import axios from "axios";
import { MongoClient } from "mongodb";
dotenv.config();
const uuidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const requireAuthentication = ["getuser", "getcompany"];
const allowedVerbs = ["GET", "POST"];

app.post("/callApi", async (req, res) => {
	let json = req.body;
	let api = String(json.api)?.trim();
	let apiName = api.indexOf(".") >= 0 ? api.substring(0, api.lastIndexOf(".")) : api;
	apiName = apiName.replaceAll("/", "").replaceAll("#", "").replaceAll("?", "");
	let verb = json.api.substring(json.api.lastIndexOf(".") + 1);
	// default to POST if no verb is provided
	if (verb === apiName) {
		verb = "POST";
	}
	console.log("api:", apiName, "verb:", verb);

	let token = json.token;
	let response;
	try {
		if (requireAuthentication.includes(apiName.toLowerCase())) {
			if (!allowedVerbs.includes(verb)) {
				res.send("Invalid verb");
				return;
			}
			if (token == process.env.tokenSecret) {
				switch (verb) {
					case "GET":
						response = await axios.get(`http://localhost:${process.env.internalPort}/${apiName}`);
						res.send(response.data);
						break;
					case "POST":
						response = await axios.post(`http://localhost:${process.env.internalPort}/${apiName}`, json);
						res.send(response.data);
						break;
					default:
						res.send("Invalid verb");
				}
			} else {
				res.send("Invalid token");
			}
		} else {
			// remove the verb from the api and default to POST
			apiName = api.replaceAll(".POST", "").replaceAll(".GET", "");
			const response = await axios.post(`http://localhost:${process.env.internalPort}/${apiName}`, json);
			res.send(response.data);
		}
	} catch (e) {
		res.status(500).end(e.message);
		console.error(e.message);
	}
});

app2.post("/getUser", async (req, res) => {
	const client = new MongoClient(process.env.MONGODB_URI);
	try {
		const userId = req.body.userId;
		if (typeof req.body === "object" && userId && userId.match(uuidFormat)) {
			await client.connect();
			const db = client.db("challenge_5");
			const user = await db.collection("users").find({ user_id: userId }).maxTimeMS(5000).toArray();
			console.log(user);
			res.send(JSON.stringify(user));
		} else {
			res.send("Invalid arguments provided");
		}
	} catch (e) {
		res.status(500).end(e.message);
		console.error(e);
	} finally {
		await client.close();
	}
});

app2.post("/getCompanies", async (req, res) => {
	const client = new MongoClient(process.env.MONGODB_URI);
	try {
		const companyId = req.body.companyId;
		if (typeof req.body === "object" && companyId && companyId.match(uuidFormat)) {
			await client.connect();
			const db = client.db("challenge_5");
			const company = await db.collection("companies").find({ company_id: companyId }).maxTimeMS(5000).toArray();
			console.log(company);
			res.send(JSON.stringify(company));
		} else {
			res.send("Invalid arguments provided");
		}
	} catch (e) {
		res.status(500).end(e.message);
		console.error(e);
	} finally {
		await client.close();
	}
});

app2.post("/CRMEntities", async (req, res) => {
	res.send(CRMEntities);
});

app.listen(process.env.externalPort, () => {
	console.log(`External API listening on PORT ${process.env.externalPort} `);
});

// Internal service; accessible only from localhost
app2.listen(process.env.internalPort, "localhost", function () {
	console.log(`Internal service started port ${process.env.internalPort}`);
});

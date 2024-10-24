// code file: index.js
const helmet = require("helmet");
const crypto = require("crypto");
const express = require("express");
const ejs = require("ejs");
const template = require("./main");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");

app.use((req, res, next) => {
	let nonce = crypto.randomBytes(16).toString("hex");
	res.locals.cspNonce = nonce;
	next();
});

app.use(
	helmet({
		xFrameOptions: { action: "deny" },
		contentSecurityPolicy: {
			directives: {
				"script-src": ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
			},
		},
	})
);

app.get("/main", async (req, res) => {
	try {
    const rendered = ejs.render(template, { nonce: res.locals.cspNonce, name: req.query.name, phone: process.env.PHONE });
    console.log(rendered);
		res.send(rendered);
	} catch (e) {
		console.error(e);
	}
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});

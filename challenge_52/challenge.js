import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
config();

const app = express();
app.use(bodyParser.json());

const users = [
	{ id: 1, username: "admin", role: "admin", secret: `${process.env.ADMIN_KEY}` },
	{ id: 2, username: "user", role: "user", secret: "not for you" },
];

app.post("/secret", (req, res) => {
	const { user } = req.body;
	let thisUser;

	// If 'admin', require a secret
	if (user.role === "admin" || user.username === "admin") {
		if (user.secret === process.env.ADMIN_KEY) {
			return res.send(`Welcome, true admin. Here's your flag: ${process.env.FLAG}`);
		} else {
			return res.status(403).send("Secret key required for admin access.");
		}
	}

	// Get user secret
	thisUser = users.find((u) => u.username == user.username);

	if (thisUser) {
		return res.status(200).send(`
        user: ${user.username} 
        role: ${thisUser.role}
        secret is: ${thisUser.secret}
    `);
	} else {
		return res.status(403).send("User not found.");
	}
});

app.listen(process.env.PORT, () => {
	console.log(`CTF running on http://localhost:${process.env.PORT}`);
});

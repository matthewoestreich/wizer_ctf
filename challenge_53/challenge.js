import express from "express";
import bodyParser from "body-parser";
import { seedDatabase } from "./seed.mjs";
import { config } from "dotenv";

config();
const app = express();
app.use(bodyParser.json());

// In-app WAF
function isMaliciousInput(input) {
	console.log("Checking input for WAF:", input);
	// prettier-ignore
	const wafRegex = new RegExp(
    [
      '(\\b(SELECT|UNION|INSERT|DELETE|UPDATE|DROP|SCRIPT|ALERT|ONERROR|ONLOAD)\\b',
      '|["();<>\\s]',
      '|--',
      '|\\b(AND|OR)\b(?!/\\*\\*\\/))'
    ].join(''),
    'i'
  );
	return wafRegex.test(input);
}

app.post("/login", (req, res) => {
	const userInput = req.body.username;

	if (typeof userInput !== "string") {
		return res.status(400).json({ error: "Username must be a string" });
	}

	if (isMaliciousInput(userInput)) {
		return res.status(403).json({ message: "❌ Blocked suspicious input by WAF" });
	}

	seedDatabase((db) => {
		const query = `SELECT * FROM users WHERE username = '${userInput}'`;
		console.log("Executing query:", query);

		db.all(query, [], (err, rows) => {
			if (err) return res.status(500).json({ error: "Database error" });

			if (rows.length > 0) {
				res.json({ users: rows });
			} else {
				res.json({ message: "No user found" });
			}

			db.close();
		});
	});
});

app.listen(process.env.PORT, () => {
	console.log(`Web server listening on port ${process.env.PORT}`);
});

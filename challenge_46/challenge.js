import express from "express";
import crypto from "crypto";

const app = express();
const port = 3000;
const wrongEmails = {};

const users = {
	"alicer@example.com": { username: "alicer", email: "alicer@example.com", password: "password123", id: "9a13048d-0eb2-4470-9274-d03eb28998a1" },
	/* another user here - hidden for the challenge */
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", (req, res) => {
	const { email, password } = req.body;
	let encryptedSentPassword = "a";
	let encryptedUserPassword = "b";

	if (!email || !password) {
		return res.status(400).send("Missing credentials");
	}

	const user = users[email];
  console.log(user, {email,password});

	if (user) {
    console.log(`Found user during login`, {user});
		encryptedUserPassword = crypto.pbkdf2Sync(user.password, "salt", 100000, 64, "sha512").toString("ascii");
		encryptedSentPassword = crypto.pbkdf2Sync(password, "salt", 100000, 64, "sha512").toString("ascii");
	} else {
    console.log(`User not found during login`, {email,password});
		// If user is not found, we still need to encrypt the password twice for time comparison
		encryptedUserPassword = crypto.pbkdf2Sync(password, "salt", 100000, 64, "sha512").toString("ascii");
		encryptedUserPassword = crypto.pbkdf2Sync(password, "salt", 100000, 64, "sha512").toString("ascii");
	}

  console.log({encryptedSentPassword, encryptedUserPassword});

	if (encryptedSentPassword === encryptedUserPassword) {
		return res.send("Login successful");
	} else {
		return res.send("Invalid credentials");
	}
});

app.post("/getId", (req, res) => {
	const email = req.body.email;

	if (!email || !users[email]) {
    console.log("NOT")
		// Check if the email is in the wrongEmails list
		if (wrongEmails[email]) {
      console.log(`Email alreqdy part of wrongEmails`, {email}, {wrongEmails});
			return res.json({
				id: wrongEmails[email].id,
			});
		}
		// If the email is not found, generate random UUID
		const id = crypto.randomUUID();
		// Store the email and id in the wrongEmails list
		wrongEmails[email] = { id: id };
    console.log({wrongEmails});
		res.json({
			id: id,
		});
		return;
	}

  console.log(users[email].id);

	res.json({
		id: users[email].id,
	});
	return;
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

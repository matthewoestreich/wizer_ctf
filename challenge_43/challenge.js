const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

function auth(req, res, next) {
  console.log({from: "auth middleware", body: req.body});
	const token = req.body["session"];
	if (!token) {
		return res.status(401).json({ message: "Authentication required" });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.status(403).json({ message: "Invalid token" });
		req.user = user;
		if (user && user.username === "admin") {
			req.admin = true;
		} else {
			req.admin = false;
		}
		next();
	});
}

// In-memory database (temporary dictionary object) including the default admin user
const users = {};
users["admin"] = { password: process.env.AdminPassword };

// Serve the entire 'public' folder as static assets
app.use(express.static(path.join(__dirname, "public")));

// Register a new user
app.post("/register", (req, res) => {
	console.log(req.body);
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ message: "Username and password are required" });
	}

  console.log(users[username]);

	// check password strength (8 char min, special char, digit, uppercase and lowercase)
	const passwordRegex = /^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

	if (!passwordRegex.test(password)) {
		return res.status(400).json({ message: "Password needs to be at least 8 charecters long and include at least one: digit, lowecase letter, uppercase letter and a special charecter" });
	}

	if (users[username]) {
		return res.status(400).json({ message: "Username already exists" });
	} else {
		//successfully registered
		const user = (users[username.trim()] = {});
		user.password = password;
		res.status(201).json({ message: "Registration successful" });
	}
});

// Login and generate a JWT token
app.post("/login", (req, res) => {
	const { username, password } = req.body;
	console.log(users);
  console.log(users[username], users[username].password)
	const user = users[username] && users[username].password === password ? { username, isAdmin: username === "admin" ? true : false } : null;
	if (!user) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
	res.json({ token });
});

// Profile page accessible only to authenticated users
app.post("/profile", auth, (req, res) => {
	if (req.admin) {
		res.json({ message: "You are the admin!" });
	} else {
		res.json({ message: "Welcome to your profile, " + req.user.username + ". You are not the admin." });
	}
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

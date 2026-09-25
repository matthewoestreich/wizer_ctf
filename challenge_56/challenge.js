const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config();

// --- Config ---
const JWT_SIGN = process.env.JWT_SIGNATURE;
if (!JWT_SIGN) {
	throw new Error("Missing JWT_SIGNATURE environment variable");
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

// In-memory database (temporary array)
const users = [];

// Serve the entire 'public' folder as static assets (optional)
app.use(express.static(path.join(__dirname, "public")));

function auth(req, res, next) {
	const token = req.body["session"]; // token expected in request body
	if (!token) {
		return res.status(401).json({ message: "Authentication required" });
	}

	// Verify the JWT token
	jwt.verify(token, JWT_SIGN, (err, user) => {
		if (err) {
			const signatureB64 = Buffer.from(JWT_SIGN, "utf8").toString("base64").replaceAll("=", "");
			return res.status(403).json({
				message: "Invalid token",
				intructions: `Please open a ticket with the following code ERR_SIGN_${signatureB64}`,
			});
		}

		req.user = user;
		req.admin = user && user.isAdmin === true;
		next();
	});
}

// Register a new user
app.post("/register", (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ message: "Username and password are required" });
	}
	const user = { username, password };
	users.push(user);
	res.status(201).json({ message: "Registration successful" });
});

// Login and generate a JWT token (no isAdmin in normal login)
app.post("/login", (req, res) => {
	const { username, password } = req.body;
	const user = users.find((u) => u.username === username && u.password === password);
	if (!user) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	const token = jwt.sign({ username }, JWT_SIGN, { algorithm: "HS256", expiresIn: "1h" });
	res.json({ token });
});

// Profile page accessible only to authenticated users
app.post("/profile", auth, (req, res) => {
	if (req.admin) {
		return res.json({ message: "You are the admin!" });
	}
	res.json({ message: `Welcome to your profile, ${req.user.username}. You are not the admin.` });
});

app.post("/admin", auth, (req, res) => {
	if (!req.admin) return res.status(403).json({ message: "Admins only" });
	res.json({ message: "Top secret admin data", flag: process.env.CTF_FLAG });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`CTF running on port ${port}`);
});

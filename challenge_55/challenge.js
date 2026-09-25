import dotenv from "dotenv";
dotenv.config();

import express from "express";
import crypto from "crypto";
const app = express();
app.use(express.json());

const XOR_KEY = crypto.createHash("md5").update("svc-telemetry").digest("hex").slice(0, 12);

function xorEncode(str, key) {
	return Buffer.from([...str].map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join("")).toString("base64");
}

const coreCredString = `svc:${Math.floor(Date.now() / 1000)}`;
const staticSessionToken = Buffer.from(coreCredString).toString("base64");

// Session storage validation
if (!process.env.SVC_LEGACY_SESSION || !process.env.SYSADMIN_SESSION) {
	throw new Error("Missing required environment variables: SVC_LEGACY_SESSION or SYSADMIN_SESSION");
}

const sessionStore = {
	alice: crypto.randomUUID(),
	bob: crypto.randomUUID(),
	svc: staticSessionToken,
	svc_legacy: Buffer.from(process.env.SVC_LEGACY_SESSION).toString("base64"),
	sysadmin: Buffer.from(process.env.SYSADMIN_SESSION).toString("base64"),
	qa_bot: crypto.randomUUID(),
	proxy: crypto.randomUUID(),
};

// Simulated user info
const users = {
	alice: { role: "user", info: "Hey Alice!" },
	bob: { role: "user", info: "Welcome Bob!" },
	svc: { role: "elevated", info: "Internal reports available." },
	svc_legacy: { role: "elevated", info: "Deprecated service account." },
	sysadmin: { role: "admin", info: "Admin console temporarily locked." },
	qa_bot: { role: "automation", info: "QA bot last pinged at 03:42 UTC." },
	proxy: { role: "service", info: "Proxy gateway ready." },
};

// Trace logger
function traceLookup(username) {
	const entry = {
		query: username,
		timestamp: Date.now(),
	};

	if (username.match(/^testd+$/)) {
		entry.context = "test-trace";
		entry.debug = `traceId:${crypto.randomBytes(4).toString("hex")}`;
	}

	if (username.includes("debug") || username.length > 25) {
		entry.context = "log-overflow";
		entry.trace = `bytes:${username.length}`;
	}

	if (username.includes("root") || username.includes("sys")) {
		entry.context = "sys-audit";
		entry.note = `tracer:${Buffer.from("noop").toString("base64")}`;
	}

	if (username.includes("proxy") || username.includes("qa")) {
		entry.context = "legacy-auth-check";
		entry.trace = `fallbackToken:${Buffer.from("validate:proxy").toString("hex")}`;
	}

	if (username.includes("svc") || username.includes("%00")) {
		entry.context = "fallback-user-lookup";
		entry.note = `tracer:${xorEncode(coreCredString, XOR_KEY)}`;
	}

	return entry;
}

// Main endpoint - profile lookup
app.get("/api/profile", (req, res) => {
	const username = req.query.user;
	if (!username) {
		return res.status(400).json({ error: "Missing user parameter." });
	}

	const user = users[username];
	if (!user) {
		return res.status(404).json({
			error: "User not found",
			metadata: traceLookup(username),
		});
	}

	res.json({
		status: "ok",
		user: username,
		info: user.info,
	});
});

app.post("/api/internal-report", (req, res) => {
	const sessionId = req.body.xSessionId;
	if (sessionId && sessionId === sessionStore.svc) {
		return res.json({
			status: "success",
			report: {
				metrics: {
					daily: [125, 117, 140],
					notes: {
						internal_summary: process.env.LAST_SUMMARY,
					},
				},
			},
		});
	}

	return res.status(403).json({ error: "Access denied." });
});

app.get("/", (req, res) => {
	res.send(`
    <h2>Welcome</h2>
    <p>Try out the <code>/api/profile?user=USERNAME</code> endpoint.</p>
  `);
});

app.listen(process.env.PORT, () => {
	console.log(`Challenge running on http://localhost:${process.env.PORT || 4000}`);
});

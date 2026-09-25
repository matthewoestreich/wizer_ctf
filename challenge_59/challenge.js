import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";

config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// --- In-App WAF ---
function isMaliciousInput(input) {
	console.log("Checking input for WAF:", input);
	const normalized = input.toLowerCase();

	const wafRegex = new RegExp(
		[
			"(<script)", // block script tags
			"(onerror)", // block image/svg errors
			"(onload)", // block onload
			"(onbegin)", // block SVG animations
			"(svg)", // block svg entirely
			"(animate)", // block animate/set
			"(javascript:)", // block js: URIs
			"(audio)", // block audio autoplay
			"(iframe)", // block iframe/srcdoc
			"(oncanplay)", // block media events
			"(onloadeddata)", // block media load events
		].join("|")
	);

	return wafRegex.test(normalized);
}

app.get("/comment", (req, res) => {
	const { message } = req.query;

	if (typeof message !== "string") {
		return res.status(400).json({ error: "Message must be a string" });
	}

	if (isMaliciousInput(message)) {
		return res.status(403).send("❌ Blocked by WAF");
	}

	const html = `
    <html>
      <head><title>Guestbook</title></head>
      <body>
        <h1>User Comment</h1>
        <div>${message}</div>
      </body>
    </html>
  `;

	res.send(html);
});

// --- Start server ---
app.listen(process.env.PORT || 3000, () => {
	console.log(`CTF challenge listening on port ${process.env.PORT || 3000}`);
});

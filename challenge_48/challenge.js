import express, { urlencoded } from "express";
import { randomBytes } from "crypto";

const app = express();
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
	const nonce = randomBytes(16).toString("base64");
	const userInput = req.query.input || "";

  console.log("Input:", req.query.input);
  console.log("Output:", `<p>Echo: ${userInput}</p>`);

	res.setHeader("Content-Security-Policy", `default-src 'none'; script-src 'nonce-${nonce}'`);

	res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>XSS Mitigation Demo</title>
        </head>
        <body>
            <h1>XSS Mitigation Demo</h1>
            <form action="/" method="GET">
                <input type="text" name="input" placeholder="Enter text" />
                <button type="submit">Submit</button>
            </form>
            <p>Echo: ${userInput}</p>
            <script nonce="${nonce}" src="/script.js"></script>
        </body>
        </html>
    `);
});

app.get("/script.js", (req, res) => {
	res.setHeader("Content-Type", "application/javascript");
	res.send(`console.log("Secure script running");`);
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});

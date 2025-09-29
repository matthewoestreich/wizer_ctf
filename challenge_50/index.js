import express from "express";
import axios from "axios";
const app = express();

process.env.INTERNAL_HEADER = process.env.INTERNAL_HEADER || "INTERNAL_HEADER";
process.env.INTERNAL_SERVICES = process.env.INTERNAL_SERVICES || "INTERNAL_SERVICES"

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/api/preview-meta", handler);

app.listen(3000, () => {
  console.log("listning.");
})

async function handler(req, res) {
	const { url } = req.query;

	if (!url || !url.startsWith("http")) {
		return res.status(400).json({ error: "Invalid or missing url parameter" });
	}

	try {
		// Log the requested URL
		console.log(`[preview-meta] Fetching: ${url}`);

		// If the URL targets an internal API route, add internal headers
		const allowInternalHeaders = url.includes("/api/internal/");
		let headers;

    console.log({url, allowInternalHeaders});

		if (allowInternalHeaders) {
      console.log("ALLOWINTERNALLHEADERS");
			headers = {
				"x-internal-header": process.env.INTERNAL_HEADER,
				"x-internal-service": process.env.INTERNAL_SERVICES,
			};
			res.setHeader("x-internal-service", process.env.INTERNAL_SERVICES);
		} else {
      console.log("NO_ALLOWINTERNALHEADERS")
			headers = {};
		}

		// Perform the request
		const response = await axios.get(url, {
			timeout: 3000,
			headers,
		});

		const contentType = response.headers["content-type"] || "";
		const data = response.data;

		// If HTML, parse metadata
		if (contentType.includes("text/html")) {
			const $ = cheerio.load(data);
			const title = $("title").text();
			const description = $('meta[name="description"]').attr("content") || "No description";

			return res.status(200).json({ url, title, description });
		}

		// Otherwise return raw (JSON or plain text)
		return res.status(200).json({ url, raw: data });
	} catch (e) {
		console.error(`[preview-meta] Error fetching URL: ${e.message}`);
		return res.status(500).json({ error: "Failed to fetch or parse URL", details: e.message });
	}
}

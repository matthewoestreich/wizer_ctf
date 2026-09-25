import express from "express";
import pkg from "body-parser";
const { json } = pkg;
import { execSync } from "child_process";

const app = express();
app.use(json());

const uuidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// In-memory "DB"
const companies = [];
// Shape: { companyId: 'uuid', folder: 'name-of-folder' }

// Sanitize folder input to prevent command injections
// prettier-ignore
const sanitizeFolder = (folder) => {
  folder = String(folder)
    .replaceAll(';', '')
    .replaceAll('|', '')
    .replaceAll('&', '')
    .replaceAll('>', '')
    .replaceAll('<', '')
    .replaceAll('!', '')
    .replaceAll('$', '') 
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('', '')
    .replaceAll('', '');

  if (!folder.endsWith('/assets')) {
    folder += '/assets';
  }
  return folder.replace('//', '/');
};

// Add/Set the company assets folder
app.post("/addAssetsFolder", (req, res) => {
	try {
		const companyId = String(req.body.companyId || "");
		let folder = sanitizeFolder(req.body.folder || "");

		if (!companyId.match(uuidFormat) || folder === "") {
			return res.status(400).send("invalid arguments provided");
		}

		const idx = companies.findIndex((c) => c.companyId === companyId);
		if (idx !== -1) {
			return res.status(400).send("company assets folder already exists");
		}

		companies.push({ companyId, folder });
		return res.sendStatus(200);
	} catch (e) {
		console.error(e.message);
		return res.status(500).send(e.message);
	}
});

// List files inside the stored assets folder
app.post("/companyAssets", (req, res) => {
	try {
		const companyId = String(req.body.companyId || "");
		if (!companyId.match(uuidFormat)) {
			return res.status(400).send("invalid company Id");
		}

		const rec = companies.find((c) => c.companyId === companyId);
		const folderName = rec?.folder;
		if (!folderName) {
			return res.status(404).send("assets folder not found");
		}

		const output = execSync(`ls -1 ${folderName}`).toString();
		return res.type("text/plain").send(output);
	} catch (e) {
		console.error(e.message);
		return res.status(500).send(e.message);
	}
});

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
	console.log(`API listening on PORT ${PORT}`);
});

export default app;

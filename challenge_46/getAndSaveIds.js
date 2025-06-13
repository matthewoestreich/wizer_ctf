import fs from "node:fs";
import path from "node:path";

// Run this first then wait a while
//getAndSaveIds("./ids.json").then(() => console.log("Done.")).catch((e) => console.log(`Something went wrong!`, e));

// Run this second then run `compareIds.js`
//getAndSaveIds("./ids-2.json").then(() => console.log("Done.")).catch((e) => console.log(`Something went wrong!`, e));

async function getAndSaveIds(saveToFilePath) {
	const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
	const results = [];

	for (const l of alpha) {
		for (const r of alpha) {
			const email = `je${l}${r}a@example.com`;
			const res = await getId(email);
			results.push({ email, id: res.id });
		}
	}

	fs.writeFileSync(path.resolve(saveToFilePath), JSON.stringify(results, null, 2));

	async function getId(email) {
		const url = "https://chal46-hj89458.vercel.app/getId";
		const body = {
			email,
		};
		const resp = await fetch(url, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!resp.ok || resp.status !== 200) {
			console.log("something went wrong!", { resp });
			return;
		}
		const result = await resp.json();
		return result;
	}
}

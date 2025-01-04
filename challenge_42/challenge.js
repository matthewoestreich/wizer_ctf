import express from "express";
import bodyParser from "body-parser";
import { CRMUsers } from "./crm.js";

const app = express();
app.use(bodyParser.json());

const availableFields = ["id", "firstName", "lastName", "phoneNumber", "title", "department", "email"];

function filter(items, field, value) {
	const filtered = [];
	for (let i = 0; i < items.length; ++i) {
		console.log({value,field,foundField:items[i][field],eq: items[i][field] === value});
		if (items[i][field] === value) {
			filtered.push(items[i]);
		}
	}
	return filtered;
}

app.post("/filterCRMUsers", function (req, res) {
	let [field, value] = [req.body.field, req.body.value];

	// Validate the field
	if(!(String(field)?.trim())) {
		field = 'id';
	}

	const fieldName = field.toString().replaceAll(",", "");

	if (availableFields.includes(fieldName)) {
		const results = filter(CRMUsers, field, value);
		res.json(results);
		return;
	} else {
		res.status(400).send(`Invalid field: ${field}`);
	}
});

app.listen(3000);
console.log("Listening on port 3000");

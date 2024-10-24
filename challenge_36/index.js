import express from 'express';
import bodyParser from 'body-parser';
import { CRMUsers } from './crm.mjs';

const app = express();
app.use(bodyParser.json());

const availableFields = [
    // currently supported fields
    'id', 'firstName', 'lastName', 'phoneNumber', 
    'title', 'department', 'email',
    // additional fields to be supported in the future
    'address', 'city', 'state', 'zip', 'country'
];

function filter(items, field, value) {
	const filtered = [];
	for (let i = 0; i < items.length; ++i) { 
		if (items[i][field] === value) {
			filtered.push(items[i]);
		}
	}
	return filtered;
}

app.post('/filterCRMUsers', function(req, res) {
	let [field, value] = [req.body.field, req.body.value];
    // Validate the field
    if(!field?.trim()) {
        field = 'id';
    }
    if(!availableFields.includes(field)) {
        res.status(400).send(`Invalid field: ${field}`);
        return;
    }
	const results = filter(CRMUsers, field, value);
	res.json(results);
});

app.listen(3000);
console.log("Listening on port 3000");
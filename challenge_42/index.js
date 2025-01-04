const { CRMUsers } = require("./crm.js");

const availableFields = ["id", "firstName", "lastName", "phoneNumber", "title", "department", "email"];

function filter(items, field, value) {
	const filtered = [];
	for (let i = 0; i < items.length; ++i) {
		if (items[i][field] === value) {
			filtered.push(items[i]);
		}
	}
	return filtered;
}

/*
const FIELD = "id,\,,firstName,lastName";
const VALUE = 1;

const FINAL_FIELD = FIELD.toString().replaceAll(",", "");

const results = filter(CRMUsers, FINAL_FIELD, VALUE);

console.log({FINAL_FIELD, results});
*/

const field = ["id"];
console.log(CRMUsers[0][field])
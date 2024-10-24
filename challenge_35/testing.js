import fs from "fs";
import path from "path";

const removeSubstringSecurely = function (text, substring) {
	if (String(text).includes(substring)) {
		return removeSubstringSecurely(text.replace(substring, ""), substring);
	}
	return text;
};

const sanitizeInput = (input) => {
	let text = removeSubstringSecurely(input, "<!");
	text = removeSubstringSecurely(text, "SYSTEM");
	text = removeSubstringSecurely(text, "ENTITY");
	text = removeSubstringSecurely(text, "DOCTYPE");
	return text;
};

const m = "\""
const str = `${m}`;

console.log(sanitizeInput(str));
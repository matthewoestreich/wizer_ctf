const isValid = (value) => {
	// prettier-ignore
	const checkMalicious = RegExp(
    `("\\$ne")+|("\\$eq")+|("\\$not")+` +
    `|("\\$in")+|("\\$nin")+|("\\$gt")+` +
    `|("\\$gte")+|("\\$lt")+|("\\$lte")+` +
    `|("\\$nor")+|("\\$and")+|("\\$exists")+` +
    `|("\\$type")+|(\\.)+|(\\^)+` +
    `|(\\[)+|(\\+)+|(\\*)+|(\"\"+)+`
  );
	const checkIsUUID = RegExp(`^.*-.*-.*-.*-.*$`);
	const stringValue = JSON.stringify(value);
	console.log({ stringValue });

	const isLength42 = stringValue.length == 42;
	const isUUID = stringValue.search(checkIsUUID) === 0;
	const isNotMalicious = stringValue.search(checkMalicious);
  console.log(stringValue.match(checkMalicious))
	console.log({ isLength42, length: stringValue.length, isUUID, isNotMalicious });
	return isLength42 && isUUID && isNotMalicious === -1;
	//return stringValue.length == 42 && stringValue.search(checkIsUUID) === 0 && stringValue.search(checkMalicious) === -1;
};

function makeUUID() {
	let str = "";
	for (let i = 0; i < 4; i++) {
		str += "a".repeat(7) + "-";
	}
	return str + "aaaaaaaa";
}
// const str = makeUUID();

const strA = "a-b-c-d-');db`collection`('users')`find`({});//";
const strB = '1", { $regex: "-" }});//aaaaaaaaaa-b-c-d-e';
let strC = "{ $regex: // });//avaaaaaaaaaaaa-b-c-d-e";
let strD = '1", { $regex: "" }});//aajaaa-b-c-d-e';
let strW = { $regex: "$", $options: `---------------` };

let str = { "$regex": "$", "$options": "--------------" }
console.log(isValid(str));

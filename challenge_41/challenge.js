import clientPromise from "../../lib/mongodb";

const isValid = (value) => {
	// prettier-ignore
	const checkMalicious = RegExp(
    `("\\$ne")+|("\\$eq")+|("\\$not")+|("\\$in")+|("\\$nin")+|("\\$gt")+|("\\$gte")+|("\\$lt")+|("\\$lte")+|("\\$nor")+|("\\$and")+|("\\$exists")+|("\\$type")+|(\\.)+|(\\^)+|(\\[)+|(\\+)+|(\\*)+|(\"\"+)+`
  );
	const checkIsUUID = RegExp(`^.*-.*-.*-.*-.*$`);
	const stringValue = JSON.stringify(value);
	return stringValue.length == 42 && stringValue.search(checkIsUUID) === 0 && stringValue.search(checkMalicious) === -1;
};

export default async (req, res) => {
	try {
		if (typeof req.body === "object" && isValid(req.body.company_id)) {
			const client = await clientPromise;
			const db = client.db("challenge_5");
			const company = await db.collection("companies").find({ company_id: req.body.company_id }).maxTimeMS(5000).toArray();
			res.send(JSON.stringify(company));
		} else {
			res.send("Invalid arguments provided");
		}
	} catch (e) {
		res.status(500).end(e.message);
		console.error(e);
	}
};

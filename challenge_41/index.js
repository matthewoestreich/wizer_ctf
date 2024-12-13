const MongoClient = require("mongodb").MongoClient;

async function testQuery(mockRequest) {
  const connectionString = "mongodb://192.168.1.157:27017/";
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const db = client.db("challenge_41");
    const qry = { company_id: mockRequest.body.company_id };
    console.log(qry)
    const all = await db.collection("companies").find({ company_id: { '$regex': '$', '$options': 'iiii-iadfafasdfasfsdi-i-iii' } }).toArray();
    console.log(all);
  } catch (e) {
    console.error(`ERROR`, e);
  } finally {
    await client.close();
  }
}

(async () => {
  const req = {
    body: {
      company_id: { "$regex": "(?i)(?-i)(?-i)(?-i)(?-i)(?-i)" }
    }
  }

  testQuery(req);
})();
import nodepath from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: nodepath.resolve(import.meta.dirname, "./.env") });
import mysql from "mysql2";
import express from "express";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const getUser = async (userName, password) => {
	let connection = mysql.createConnection(process.env.DATABASE_URL);

	// Validate user input to prevent SQL injection
	// prettier-ignore
	if (!userName || 
        !password || 
        userName.length > 20 || 
        password.length > 20 || 
        userName.length < 3 || 
        password.length < 3 || 
        /[<>=]/.test(userName) || 
        /[<>=]/.test(password) ||
        userName.toLowerCase().includes("true") ||
        password.toLowerCase().includes("true")) {
        connection.end();
        throw new Error("Invalid username or password");
    }
	// prettier-ignore
	const query = `SELECT userName, password, firstName, lastName FROM all_users
                    WHERE userName = '${userName}' and password = '${password}' limit 1`;
	const [rows, fields] = await connection.promise().query(query);

	connection.end();
	return rows;
};

const login = async (userName, password) => {
	const rows = await getUser(userName, password);
	if (rows.length === 1) {
		// prettier-ignore
		return {"message": "successfully logged on", 
      "type": rows[0].type, 
      "firstName": rows[0].firstName, 
      "lastName": rows[0].lastName, 
      "userName": rows[0].userName, 
      "status": "success"
    };
	}

	return { message: "Invalid username or password", status: "failed" };
};

app.post("/api/login", async (req, res) => {
	try {
		const result = await login(req.body.user, req.body.password);
		if (result.status === "success") {
			res.status(200).send(result);
		} else {
			res.status(401).send(result);
		}
	} catch (e) {
		res.status(500).send({ message: e.message, status: "failed" });
	}
});

app.listen(3000, () => {
  console.log("listening on port 3000");
})
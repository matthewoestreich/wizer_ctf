import dotenv from 'dotenv';
import mysql from 'mysql2';
import crypto from 'crypto';
dotenv.config();

const getUser = async (userName) => {
    let connection = mysql.createConnection(process.env.DATABASE_URL);

    const query = `SELECT * FROM users2
                    WHERE userName = '${userName}'`;
    const [rows, fields] = await connection.promise().query(query);
    connection.end();
    return rows;
}

const login = async (userName, password, res) => {
    const hashedPassword = crypto.createHash('md5').update(String(password)).digest("hex");
    userName = userName.replaceAll("'", "");
    const rows = await getUser(userName);
    if(rows.length === 1) {
        const hashed = rows[0].password;
        if(hashed === hashedPassword) {
            return rows;
        } else {
            res.setHeader('Hashed', hashed);
        }
    }

    return "Invalid user or password";
};
  
export default async (req, res) => {
    try {
        const result = await login(req.body.userName, req.body.password, res);
        if(Array.isArray(result) && result.length > 0) {
            res.status(200).send(result);
        } else {
            res.status(401).send(result);
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
};

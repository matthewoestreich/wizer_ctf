import dotenv from 'dotenv';
import mysql from 'mysql2';
dotenv.config();

const getUser = async (userName, password) => {
    let connection = mysql.createConnection(process.env.DATABASE_URL);
    const query = `SELECT userName, password, type, firstName, lastName FROM all_users
                    WHERE userName = '${userName}' and password = '${password}' limit 1`;
    const [rows, fields] = await connection.promise().query(query);

    connection.end();
    return rows;
}

const login = async (userName, password) => {
    const rows = await getUser(userName, password);
    if(rows.length === 1) {
        return {"message": "successfully logged on", 
            "type": rows[0].type, 
            "firstName": rows[0].firstName, 
            "lastName": rows[0].lastName, 
            "userName": rows[0].userName, 
            "status": "success"
        };
    }
    
    return { "message": "Invalid username or password", "status": "failed" };
};
  
export default async (req, res) => {
    try {
        const result = await login(req.body.user, req.body.password);
        if(result.status === "success") {
            res.status(200).send(result);
        } else {
            res.status(401).send(result);
        }
    } catch (e) {
        res.status(500).send({ "message": e.message, "status": "failed" });
    }
};
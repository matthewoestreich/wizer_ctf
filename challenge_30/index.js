// api/player.js
import dotenv from 'dotenv';
import mysql from 'mysql2';
dotenv.config();

const getPlayer = async (playerId) => {
    if(playerId && String(playerId).trim() !== '' && !isNaN(playerId)) {
        let connection = mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM players 
                        WHERE id = ${playerId}`;
        const [row, fields] = await connection.promise().query(query);
        connection.end();
        return row;
    }
}

export default async (req, res) => {
    try {
        const result = await getPlayer(req.body.playerId);
        if(result.length > 0) {
            res.status(200).send(result);
        } else {
            res.status(401).send("Player not found!");
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
};

// api/friends.js
import dotenv from 'dotenv';
import mysql from 'mysql2';
dotenv.config();

const getFriends = async (playerId) => {
    if(playerId && String(playerId).trim() !== '' && !isNaN(playerId)) {
        let connection = mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT p2.* FROM players p join friends f on p.id = f.player_id join players p2 on f.friend_id = p2.id
                        WHERE p.id = ${playerId} order by f.friend_id desc`;
        const [rows, fields] = await connection.promise().query(query);
        connection.end();
        return rows;
    }
}

export default async (req, res) => {
    try {
        const result = await getFriends(req.body.playerId);
        if(result.length > 0) {
            res.status(200).send(result);
        } else {
            res.status(401).send("No friends found!");
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
};
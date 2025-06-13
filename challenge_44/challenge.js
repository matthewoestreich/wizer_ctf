import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { getFlag } from './flag.js';

config();
const app = express();
app.use(bodyParser.json());

// Simulated database of user accounts
const userDatabase = {
  admin: { username: 'admin', role: 'admin'},  
  user: { username: 'user', role: 'user' },
};

// Deserialize user session data
function deserializeSession(serializedData) {
  return eval(`(${serializedData})`);
}

// Route to handle user session
app.post('/login', (req, res) => {
  const { sessionData } = req.body;

  if (!sessionData) {
    return res.status(400).send('Session data is required.');
  }

  try {
    // Deserialize the session data
    const session = deserializeSession(sessionData);
    
    if (session && userDatabase[session.username]) {
      const user = userDatabase[session.username];
      res.send(`Welcome ${user.username}! Your role is: ${user.role}`);
    } else {
      res.status(401).send('Invalid session data.');
    }
    RevertDefaultUsersChanges();
  } catch (err) {
    console.error('Deserialization error:', err);
    res.status(500).send('An error occurred while processing the session data.');
  }
});

// Reset the admin and user accounts to their default values
const RevertDefaultUsersChanges = () => {
  userDatabase.admin = { username: 'admin', role: 'admin' };
  userDatabase.user = { username: 'user', role: 'user' };
}

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
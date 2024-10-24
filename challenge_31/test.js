const crypto = require("crypto");

// b7e283a09511d95d6eac86e39e7942c0

const password = 'b7e283a09511d95d6eac86e39e7942c0';
const hash = crypto.createHash('md5').update(String(password)).digest("hex");

console.log(password, hash);
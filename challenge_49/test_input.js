


function testInput(input) {
  if (input.length > 20) {
    return `length > 20 | ${input.length}`;
  }
  if (input.length < 3) {
    return `length < 3 | ${input.length}`;
  } 
  if (/[<>=]/.test(input)) {
    return "input contains '<>='";
  }
  if (input.toLowerCase().includes("true")) {
    return "input contains 'true'";
  }
  const query = `SELECT userName, password, type, firstName, lastName FROM all_users
  WHERE userName = '${input}' and password = '$pw_placeholder$' limit 1`;
  return query;
}


const str = "'OR'1'LIKE'1'-- "
console.log(testInput(str));

/*
const un = "a' OR 1 BETWEEN 1 --"
const pw = "xyz"
console.log(
  `SELECT userName, password, type, firstName, lastName FROM all_users
  WHERE userName = '${un}' and password = '${pw}' limit 1`
);
*/
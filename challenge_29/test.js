function mockQuery(userName, password) {
  const query = `SELECT userName, password, type, firstName, lastName FROM all_users
                    WHERE userName = '${userName}' and password = '${password}' limit 1`;
  return query;
}

console.log(mockQuery(`'=0--+`))
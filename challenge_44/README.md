# Challenge

Make the app get the flag for you!

https://chal44-bcmnvx3.vercel.app/login

# Solution

This one was super easy since they're using `eval`.. The doors are basically wide open when passing user input to eval..so pick your poison.

I used an IIFE to change the role of the admin user within the "database" to `getFlag()`. So, when the admin's data was returned from the database, their role was the flag.

This is the "script" I wrote that they pass to `eval`:

```js
const payload = "(() => {userDatabase.admin.role = getFlag();return { username: 'admin' }})()";
```
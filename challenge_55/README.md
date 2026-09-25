# #55: Phantom Access

Get the internal report and win the flag!

https://chal55-xccxgd.vercel.app/api/internal-report

# Solution

The goal is to essentially find the `svc` session token

```js
const sessionStore = {
  alice: crypto.randomUUID(),
  bob: crypto.randomUUID(),
  // THIS TOKEN
  svc: staticSessionToken,
  //   ^^^^^^^^^^^^^^^^^^
  svc_legacy: Buffer.from(process.env.SVC_LEGACY_SESSION).toString("base64"),
  sysadmin: Buffer.from(process.env.SYSADMIN_SESSION).toString("base64"),
  qa_bot: crypto.randomUUID(),
  proxy: crypto.randomUUID(),
};
```

The `staticSessionToken` is generated like this:

```js
const coreCredString = `svc:${Math.floor(Date.now() / 1000)}`;
const staticSessionToken = Buffer.from(coreCredString).toString("base64");
```

They essentially give you the secret here, just that it's encoded:

```js
if (username.includes("svc") || username.includes("%00")) {
  entry.context = "fallback-user-lookup";
  entry.note = `tracer:${xorEncode(coreCredString, XOR_KEY)}`;
  //                               ^^^^^^^^^^^^^^
}
```

It is encoded using this key and function:

```js
const XOR_KEY = crypto.createHash("md5").update("svc-telemetry").digest("hex").slice(0, 12);

function xorEncode(str, key) {
  return Buffer.from([...str].map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join("")).toString("base64");
}
```

The key will never change, though. It is ALWAYS the same thing. So you can essentially reverse the `xorEncode` function, pass the secret they gave to you (`entry.note = tracer:${xorEncode(coreCredString, XOR_KEY)}`) into the reversed "xorDecode" function (that you made), to pull the `coreCredString` from it.

In order to write a decode function, you need to:

- Convert the hex string back into actual bytes (or string chars).
- Base64-decode the string.
- XOR each character with the same key to get the original string.

From there, you just base64 encode the decoded result, and send the to endpoint.

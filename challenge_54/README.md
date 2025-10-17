#  #54: Highly Protected Comments 

Inject an alert("Wizer"). URL = https://chal54-fiu36s.vercel.app/comment

# Solution

DOM clobbering - it looks for `window.isDebugMode`. In the browser, when you set an elements ID, the text used as the ID gets attached to the `window` object. So if you set an element `<input id="fooBar">` then `window.fooBar === true` is true...

They are also using a static nonce, which without it would make it impossible.
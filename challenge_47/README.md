# Challenge

Inject an alert("Wizer"). Note: you'd need a unique session Id (sid) query argument.

# Solution

This one was kind of easy.

Just had to find an appropriate markdown XSS payload. I had to modify one I found online. I modified the 2nd `Image` payload I found [here](https://github.com/JakobTheDev/information-security/blob/master/Payloads/md/XSS.md#images) : 

```
![Escape SRC - onerror]("onerror="alert('ImageOnError'))
``` 
to 
```
![ ]("onerror="alert('Wizer'&#41;)
```
I had to replace the first closing `)` with `&#41;` (the 2nd to last character), which is HTML encoding for a `)`. 

You just need to create a valid UUID then send a `POST` request to `<URL>/comment?sid=<YOUR_UUID>` with an `application/x-www-form-urlencoded` encoded body where the body is `comment=<PAYLOAD>`. Then just visit `<URL>/?sid=<YOUR_UUID>` which, is also the payload you send to pass the challenge. 
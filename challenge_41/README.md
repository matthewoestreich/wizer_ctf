# Challenge

Via Companies API, get the list of all companies

# Solution

I found this one quite difficult.. 

I realized early on that the 'validation test' doesn't include `$regex` operator, so I started there. After trying MANY diff variations of strings, it finally clicked that I could send a plain object vs a string. I didn't need to try and escape the string, I could just send the payload already "escaped", if you will. 

We can do this because the validation function calls `JSON.stringify` to run validation checks and doesn't expect a string to be passed in.

From there it was just trying a ton of diff payloads..

#### Getting Close

This payload worked on my local Mongo install, but for some reason, kept error out due to bad `$options` flag:

```
{
  "company_id": { "$regex": "$", "$options": "--------------" }
}
```

It was extremely frustrating to see it work locally but not on the CTF....

#### Almost

I stumbled upon this regex (`"(?i)a(?-i)cme"`), that essentially says to match anything that starts with `"a"` (case-insensitive) and ends in `"cme"`.  The `(?i)` is the start of the case-insensitive search and the `(?-i)` is the end of the search. Therefore, only `"a"` is allowed to be case-insensitive.

I wound up finding this query on MongoDB's website, of all places... Thanks Mongo!

![Thanks Mongo](/challenge_41/thanksMongo.png "Thanks for the query Mongo!")

#### Finally

Since the query I found essentially says "any character between these two 'flags'", I wondered if providing no characters meant all characters would pass, and bam, sure enough.

Just had to make sure to cover the length and UUID validations. Conveniently, the query ends perfectly so nothing tricky was needed to meet the length validation, and the regex contains the dashes needed for the UUID validation.

```
{
  "company_id": { "$regex": "(?i)(?-i)(?-i)(?-i)(?-i)(?-i)" }
}
```

#### Goodnight

The biggest flaw in this implementation is passing in the original `request.body.company_id` payload into the query itself. Even after validation, the "sanitized" payload is discarded. Which blows my mind.
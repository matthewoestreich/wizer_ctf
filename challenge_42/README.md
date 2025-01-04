# Challenge

Get the full unfiltered list of CRM users using '/filterCRMUsers' endpoint and win the flag!

# Solution

This one was super frustrating for me. Mostly because it was a "level 1" and I was struggling with it (lower difficulty = easier). I passed the previous "level 3" challenge in shorter amount of time.. go figure..

Anyway...

I knew the overall objective was to force a field to evaluate to 'undefined' for each CRMUser (this is similar to challenge 36, so see that challenge for a better understanding of what I mean by this).

For the longest time I thought it was a prototype pollution vuln (via the 'value' field using 'valueOf' inside injected `__proto__`). So I messed with that for like two hours.

## Getting Close

Then I actually took a step back and realized that after cleaning up `field` (which gets stored as `fieldName`) we use `fieldName` to validate available fields, but still use `field` within the `filter` function.. 

So, we use the 'sanitized' value to verify we have a valid field, but still use the 'raw' value inside our `filter` function..

This will be important later..

Example:

```js
app.post("/filterCRMUsers", function (req, res) {
  // ...

  // We clean up `req.body.field` into `fieldName`.
  // This is like pseudo coercion, so to speak, but we are also removing commas.
  const fieldName = field.toString().replaceAll(",", "");

  // We use the cleaned up `fieldName` to verify it's an acceptable field...
  if (availableFields.includes(fieldName)) {
    // ...BUT still pass the raw `field` (from `req.body.field`) into the `filter` function...
    const results = filter(CRMUsers, field, value);
    res.json(results);

  // ...
});
```

## 💡

Then the lightbult turned on... in the `filter` function we are checking each CRMUser via bracket notation, which means there will be coercion.

For example:

```js
const data = { name: "foo" };
const field = ["name"]; // coerced into `"name"`
console.log(data[field]); // -> "foo"
```

Under the hood, `field` will be coerced into a string as to satisfy bracket notation.. So it becomes: `"name"`.

Meaning, we can force each CRMUser object to return `undefined` for a non-existent field by "smuggling" an empty string as the second array element. 

This way our validation checks still pass successfully (remember, we are passing `field` into `filter` and not the cleaned up `fieldName`) but we get the `undefined` return we are looking for.

For example:

```js
const data = { name: "foo" };
const field = ["name",""]; // coerced into `"name",`
console.log(data[field]); // -> undefined
```

## Finally

So therefore if we send our payload as...

```js
{ "field": ["id",""] } // note: `"id"` can be any valid field
```

...without a `value` field, we successfully meet the `if` condition inside of the `filter` function.


```js
// snippet from `filter` function
if (items[i][field] === value) {
  // push into return array
}
// `items[i][field]` evaluates to `undefined` due to coercion and passing unfiltered `req.body.field`.
// `value` also evaluates to `undefined` since we didn't provide it...
```

...and we get all unfiltered CRMUsers...

## Til Next Time

I'm so out of it and drained from over-thinking this one, so forgive me if this explanation is all over the place, I wanted to get it all out of my head before signing off.
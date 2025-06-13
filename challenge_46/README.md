# Challenge

Get the Id of the second user from the API, given the email address is: je**a@example.com

# Solution

## Initial Thoughts and Steps

At first I was trying to pollute the `wrongEmails` object so that I could create a predictable id for each entry, which would give me something to compare against, but that didn't work.

I also tried timing attacks via the `/login` endpoint, but there wasn't a noticable difference in response times. Even when using passwords that were 150,000 characters long, which, in theory, would cause hashing to take longer. I couldn't go over ~150k characters without the API throwing an error.

## Solving

This one was rather odd - I actually couldn't find the "hacker" solution, so I kind of abused the CTF setup.

## Speedbump

They make it difficult to determine which emails are wrong and which emails actually exist. They do this by caching wrong emails in an object, then returning "that" wrong email if you send another request. This means if you send a request for an incorrect email, sending another request will yield the same id, not a new one, therefore you cannot just compare ids on a per request basis.

## Speedbumps = Ramps

If you're brave enough a speedbump can be a ramp..

Essentially, the CTF instances appear to get restarted or "cleaned" every so often, so I just needed to save the generated ids, wait for the instance to get "cleaned", then compare the ids I have saved to the newly generated ones. If this works, the only ID that won't change is for the email that is actually valid.

## Done

[I wrote a script](./getAndSaveIds.js) to send a request for each variation of the email `je**a@example.com` (eg. `jeaaa@example.com`, `jeaba@example.com`, `jeaca@example.com`, etc..) and stored the ids for each email, which I then saved as a .json file. 

After waiting 15 min or so (enough time for the CTF instance to reset, so the cached `wrongEmails` object would be cleared, and therefore generate new/different ids), I ran the script again and just compared ids - sure enough there was only one variation that was the same....

![my name is](./jeff.png)
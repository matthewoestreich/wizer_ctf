
# #60: #60: List of Company Assets #2

Read the content of /etc/protocols file to win the flag!

# Solution

- Get a UUID, doesn't matter where you get it
- They aren't filtering back tics or comments in the sanitizer
- We can send a specially crafted folder name that `cat` the contents of `../../etc.protocols` and comments out the end (so we ignore the `assets` they stick on the end)
- We get the contents back from `../../etc/protocols` within the error message
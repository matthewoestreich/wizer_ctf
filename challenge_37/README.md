# Objective

Trick the user into inserting their username and password within a fake login page, show 'Dave, please login <a href="https://chal15.vercel.app">here</a> to open a ticket'

# Solution

Use XSS with the following URL: `https://chal37-fgj589f.vercel.app/main?name=Dave, please login here to open a ticket <a href="https://chal15.vercel.app/"`
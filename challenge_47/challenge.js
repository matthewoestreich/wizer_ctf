import express from "express";
import { static as serveStatic } from "express";
import pkg from "body-parser";
const { urlencoded } = pkg;
import { render } from "slimdown-js";
import DOMPurify from "isomorphic-dompurify";

var ssn;
const app = express();
const PORT = 3000;
// parser json
app.use(urlencoded({ extended: false }));
app.use(express.json());

// Middleware
app.use(serveStatic("public")); // to serve the HTML form

const sessions = {};

const getSession = (req) => {
	const uuidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
	const sid = req.query.sid;
	if (sid && sid.match(uuidFormat)) {
		if ((ssn = sessions[sid])) {
			//Session found
			ssn = sessions[sid];
		} else {
			//Session not found
			ssn = sessions[sid] = {};
		}
	} else {
		ssn = {};
	}
	return ssn;
};

// Added by me
// I wanted to be able to see how DOMPurify was rendering the provided markup
app.get("/print-sessions", (req, res) => {
  res.json(sessions);
});
// done added by me

// Routes
app.get("/", (req, res) => {
	ssn = getSession(req);
	ssn.comments = ssn.comments || [];
	let commentHtml = ssn.comments.map((c) => `<div class="comment">${c}</div>`).join("<hr/>");
	res.send(`
    <html>
      <head>
        <title>Markdown Comments</title>
        <style>
          body { font-family: sans-serif; padding: 2em; }
          textarea { width: 100%; height: 100px; }
          .comment { background: #f9f9f9; padding: 1em; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Leave a Comment</h1>
        <form action="/comment?sid=${DOMPurify.sanitize(req.query.sid)}" method="POST">
          <textarea name="comment" placeholder="Write your comment using Markdown..."></textarea><br>
          <button type="submit">Submit</button>
        </form>
        <h2>Comments</h2>
        ${commentHtml || "<p>No comments yet.</p>"}
      </body>
    </html>
  `);
});

app.post("/comment", (req, res) => {
	const markdown = req.body.comment || "";
	const cleanMarkdown = DOMPurify.sanitize(markdown);
	const html = render(cleanMarkdown);
	ssn = getSession(req);
	ssn.comments = ssn.comments || [];
	ssn.comments.push(html);
	res.redirect("/?sid=" + req.query.sid);
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});

import express from "express";
import { render } from "ejs";

const app = express();

const template = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title><%= title %></title>
  <%- headerTag %>
  <style>
    :root { color-scheme: light dark }
    body{font-family:system-ui,Arial,sans-serif;margin:3rem;max-width:850px}
    h1{font-weight:700;margin-bottom:.25rem}
    .lead{color:#555;margin-top:0}
    .hero{padding:1rem 0 2rem}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}
    .card{border:1px solid #ddd;padding:1rem;border-radius:.75rem}
    .muted{color:#666;font-size:.95rem}
    a{color:inherit}
  </style>
</head>
<body>
  <section class="hero">
    <h1><%= company %> Document Management</h1>
    <p class="lead">Secure, organized, and fast. Upload, search, and collaborate across your teams with confidence.</p>
  </section>

  <section class="grid">
    <div class="card">
      <h3>Centralized Library</h3>
      <p class="muted">All your documents in one place with role-based access controls and detailed activity history.</p>
    </div>
    <div class="card">
      <h3>Frictionless Reviews</h3>
      <p class="muted"> Inline comments, versioning, and approvals keep work moving without email chains.</p>
    </div>
    <div class="card">
      <h3>Anywhere Access</h3>
      <p class="muted">Modern, responsive UI optimized for desktop and mobile so your team can stay productive.</p>
    </div>
  </section>

  <footer class="muted" style="margin-top:2rem">
    © <%= new Date().getFullYear() %> <%= company %>. All rights reserved.
  </footer>
</body>
</html>`;

function makeIconTag(icon) {
	return `<link rel="icon" href="/assets/${icon}">`;
}

app.get("/", (req, res) => {
	const title = "Welcome";
	const company = "Acme";
	const icon = String(req.query.icon ?? "favicon.png");
	const headerTag = makeIconTag(icon);
	const html = render(template, { title, company, headerTag });
  console.log(html);
	res.set("Content-Type", "text/html; charset=utf-8").send(html);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`App listening on http://localhost:${port}`));

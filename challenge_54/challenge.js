import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const nonce = uuidv4();

app.get("/comment", (req, res) => {
	const rawComment = req.query.comment || "No comment provided";

	// prettier-ignore
	res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}'; object-src 'none';`
  );

	// prettier-ignore
	// Escape the comment to prevent XSS
	const escapedComment = rawComment
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

	res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Comment Viewer</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; }
        </style>
      </head>
      <body>
        <h1>User Comment</h1>
        <div id="comment">${escapedComment}</div>
        <div id="debug-zone"></div>
        <script nonce="${nonce}">
        window.addEventListener('DOMContentLoaded', () => {
            // Only allow form elements to be injected for debugging
            const commentParam = new URLSearchParams(window.location.search).get('comment');
            if (commentParam) {
              const decoded = decodeURIComponent(commentParam);
              
              // Only inject if it contains a form element (Debugging)
              if (decoded.includes('<form') && decoded.includes('</form>')) {
                const debugZone = document.getElementById('debug-zone');
                debugZone.innerHTML = decoded;
                console.log("made it past step 1");
                
                // Only execute scripts if debug mode is enabled
                if (window.isDebugMode) {
                  console.log("made it past step 2");
                  const scripts = debugZone.querySelectorAll('script');
                  scripts.forEach(script => {
                    // Only execute scripts with the correct nonce
                    if (script.nonce === '${nonce}') {
                      // Create a new script element and append it to execute
                      const newScript = document.createElement('script');
                      newScript.textContent = script.textContent;
                      newScript.nonce = script.nonce;
                      document.body.appendChild(newScript);
                    }
                  });
                }
              }
            }
            
            // Check if debug mode is enabled
            if (window.isDebugMode) {
              console.log('Debug mode is enabled!');
            }
          });
        </script>
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log("Vulnerable app running at http://localhost:3000/comment"));

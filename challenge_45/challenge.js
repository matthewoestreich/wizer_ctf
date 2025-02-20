import { config } from 'dotenv';
config();
import express from 'express';
import marked from 'marked';
var ssn;
const app = express();
app.use(express.urlencoded({ extended: true })); // Built-in Express parser
app.use(express.json());
const sessions = {};

const getSession = (req) => {
    const uuidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    const sid = req.query.sid;
    if(sid && sid.match(uuidFormat)){
        if(ssn = sessions[sid]){
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

// Homepage
app.get('/', (req, res) => {
    ssn = getSession(req);
    ssn.comments = ssn.comments || [];
    res.send(`
        <h1>Leave a Comment</h1>
        <form action="/comment?sid=${req.query.sid}" method="POST">
            <textarea style="width:250px;height:150px" name="content"></textarea><br>
            <button type="submit">Submit</button>
        </form>
        <h2>Comments</h2>
        ${ssn.comments.join('<br>')}
    `);
});

// Store and Render User Comments
app.post('/comment', (req, res) => {
    const userInput = req.body.content;
    const renderedContent = marked.parse(userInput);
    ssn = getSession(req);
    ssn.comments = ssn.comments || [];
    ssn.comments.push(renderedContent);
    res.redirect('/?sid=' + req.query.sid);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});
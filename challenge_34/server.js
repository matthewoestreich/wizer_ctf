const express = require('express');
const pug = require('pug');
var bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());

app.post('/api/getWelcomeMessage', (req, res) => {
    const fullName = req.body.fullName || 'Guest';

    let templateString = '';
    const adminKey = process.env.ADMIN_KEY || "THIS_IS_THE_ADMIN_KEY";
  
    if(req.body.adminKey === adminKey) {
      templateString = `| Welcome Admin! (Admin Key: **********${adminKey.substring(adminKey.length - 4)})`;
    } else {
      templateString = `| Welcome ${fullName}!`;
    }

    const output = pug.render(templateString);

    res.send(output);
});

process.env.PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost${process.env.PORT}`);
});
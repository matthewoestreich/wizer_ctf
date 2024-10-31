const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const profiles = require('./profiles');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
const ejs = require('ejs');

app.get('/profileName', async (req, res) => {
    try {
        const query = req.query;
        console.log(query);

        if (query.username) {
            const username = Array.isArray(query.username) ? query.username : [query.username];
            res.send({ "value": profileInternal(username, query.key, query.profileMessage) });
            return;
        }
        res.send(`No name provided`);
    } catch (e) {
        res.send(e.message);
        console.error(`[/profileName][error]`, e.message);
    }
});

const profileInternal = (usernames, key, profileMessage) => {
    let filteredProfiles = [];
    console.log(key, process.env.superAdminCode)
    let keyCheck = key === process.env.superAdminCode; 

    // If multiple usernames are provided, handle them differently and require the key to be valid
    // or a valid super admin code
    if (Array.isArray(usernames) && usernames.length > 1) {
        for (let i = 0; i < usernames.length; i++) {
            let username = usernames[i];
            const profileInfo = profiles.find(profile => profile.username === username);
            
            if (profileInfo) {
                keyCheck |= (key ? profileInfo.key === key : false);
                if (keyCheck) filteredProfiles.push(profileInfo);
            }
        }
        return filteredProfiles.length && keyCheck ? filteredProfiles : keyCheck ? 'no-matching-profiles' : "Invalid key";
    } else {
        let username = usernames[0];
        let profileInfo = profiles.find(profile => profile.username === username);

        // Validate the key only if provided
        if (key && profileInfo) {        
            return profileInfo.key === key ? profileInfo : 'Invalid key';
        }
        if(profileMessage) {
            console.log(`[profileInternal] : found profile message`, {profileInfo});
            return renderProfile(profileMessage, profileInfo.name);
        }
        return profileInfo ? profileInfo.name : 'profile-not-found';
    }
};

app.post('/checkKeyValidity', async (req, res) => {
    try {
        const { username, key } = req.body;
        res.send({ "valid": profiles.find(
            profile => (profile.username === username && profile.key === key)
        ) ? true : false }); 
    } catch (e) {
        res.send(e.message);
        console.error(e.message);
    }
});

// Template rendering function
// Example of a template: "Hello, <%= name %>!"
const renderProfile = (template, name) => {
    console.log(`in renderProfile`, {template, name});
    // List of disallowed keywords to prevent template injection
    const forbiddenKeywords = [
        "process", "eval", "require", "profiles",  
        "exec", "spawn", "fork", "child", "execFile", 
        "execSync", "execFileSync", "atob", "("
    ];

    // Check if any forbidden keyword is present in the template
    const hasForbiddenKeywords = forbiddenKeywords.some(keyword => template.includes(keyword));

    if (!hasForbiddenKeywords) {
      console.log(`[renderProfile][success] : no forbidden keywords found`);
        // Render the template safely
        const message = ejs.render(template, { name });

        // Profile keys start with '!!!' to indicate sensitive data
        // Check if the rendered message contains sensitive markers
        if (!message.includes('!!!')) {
            return message;
        }
    } else {
      console.log(`[renderProfile][error] : forbidden keywords found!`);
    }
    
    // Fallback if the template is unsafe or contains sensitive data
    return name;
};

app.listen(process.env.port, () => {
    console.log(`API listening on PORT ${process.env.port}`);
});

module.exports = app;
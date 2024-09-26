const exp = require('express');
const cors = require('cors');
const app = exp();
const conn = require('./config/db');
const fs = require('fs');
const path = require('path');

// connect
conn();

// require .env
require('dotenv').config();

// get port
const PORT = process.env.PORT || 3000;

// allow cross site commections
app.use(cors());

// automatically convert json str to object
app.use(exp.json());

// api
const api = require('./routes/db_routes');
app.use('/todos', api);

// ---- frontend build ----
// check if build exists
if (fs.existsSync(path.join(__dirname, 'build'))) {

    // server as static file
    app.use(exp.static(path.join(__dirname, 'build')));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

    console.log("\x1b[38;5;2m[client] Build folder detected, opening on '*'\x1b[0m");

} else {

    app.get("*", (req, res) => {
        res.status(404).end();
    });

    console.log("\x1b[38;5;196m[client] No build folder detected. Returning 404 on '*'\x1b[0m");
}

// listen on PORT
app.listen(PORT, (e) => {
    if (e) {
        console.log('\x1b[38;5;196m[exp] Could not start express server: \x1b[0m' + e);
    } else {
        console.log('\x1b[38;5;2m[exp] Server started succesfully.\x1b[0m');
        console.log('\x1b[38;5;2m[exp] Opened port ' + PORT + "\x1b[0m");
    }
})
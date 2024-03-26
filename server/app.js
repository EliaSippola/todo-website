const exp = require('express');
const cors = require('cors');
const app = exp();
const conn = require('./config/db');

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

// listen on PORT
app.listen(PORT, (e) => {
    if (e) {
        console.log('\x1b[38;5;196m[exp] Could not start express server: \x1b[0m' + e);
    } else {
        console.log('\x1b[38;5;2m[exp] Server started succesfully.\x1b[0m');
        console.log('\x1b[38;5;2m[exp] Opened port ' + PORT + "\x1b[0m");
    }
})
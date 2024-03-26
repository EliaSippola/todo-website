const mong = require('mongoose');
require('dotenv').config();
const url = process.env.MONGODB_URL;

// connect to db and get conn
const conn = async () => {
    try {
        await mong.connect(url);
        console.log("\x1b[38;5;2m[exp] Database connected succesfully\x1b[0m");
    } catch (e) {
        console.error.bind(console, '\x1b[38;5;196m[exp] Database connection error: \x1b[0m' + e.message);
    }
}

// export
module.exports = conn;
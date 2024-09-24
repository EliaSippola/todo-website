const User = require('../models/db_schema');

// .env
require('dotenv').config();

// api key
local_api_key = process.env.LOCAL_API_KEY;

// get req
exports.getReq = (req, res) => {
    res.status(200).json({
        "response": "No GET request provided, use POST for getting data"
    }).end();
}

// post req
exports.postReq = async (req, res) => {

    // check for api key
    if (req.body.api_key !== local_api_key) {
        res.status(401).json({
            "request_error": "api_key not correct",
            "request_status": "401 Unauthorized"
        }).end();
        return;
    }

    const reqType = req.body.request_type;

    // check if username and password are good
    if (reqType === 'CHECK_CREDENTIALS') {
        // get content
        const username = req.body.username;
        const password = req.body.password;

        // check content
        if (username === null || username === '' || password === null || password === '') {
            res.status(400).end();
            return;
        }

        const user = await User.findOne({password:password, username:username});

        res.status(200).json(user).end();
        return;

    // post data
    } else if (reqType === 'CREATE_TODO') {

        // get content
        const text = req.body.content;
        const id = req.body.userId;

        // check content
        if (text === null || text === '' || id === null || id === '') {
            res.status(400).end();
            return;
        }

        // try posting to db
        try {
            await User.updateOne({_id:id}, {
                $push: {
                    todos: [{text:text}]
                }
            })
            res.status(200).end();
        } catch (e) {
            res.status(500).end();
            console.log('Server error on request: ' + e);
        }

    // get data
    } else if (reqType === 'GET_TODOS') {

        const id = req.body.userId;

        if (id == null) {
            res.status(200).json({}).end();
        }

        try {
            const todos = await User.find({_id:id}, "todos");
            res.status(200).json(todos).end();
        } catch (e) {
            res.status(500).end();
            console.log('Server error on request: ' + e);
        }


    // post data
    } else if (reqType === 'CREATE_USER') {

        // get content
        const username = req.body.username;
        const password = req.body.password;

        // check content
        if (username === null || username === '' || password === null || password === '') {
            res.status(400).end();
            return;
        }

        // try posting to db
        try {
            const user = new User({
                username: username,
                password: password
            });

            const save = await user.save();
            res.json(save);

            res.status(200).end();
        } catch (e) {
            res.status(500).end();
            console.log('Server error on request: ' + e);
        }


    // on invalid type
    } else {
        res.status(400).json({
            "request_error": "request_type missing or incorrect.",
            "request_types": [
                "CHECK_CREDENTIALS",
                "CREATE_TODO",
                "GET_TODOS",
                "CREATE_USER"
            ],
            "request_status": "400 Bad request"
        }).end();
    }
}

// delete req
exports.deleteReq = async (req, res) => {

    // check for api key
    if (req.body.api_key !== local_api_key) {
        res.status(401).json({
            "request_error": "api_key not correct",
            "request_status": "401 Unauthorized"
        }).end();
        return;
    }

    const userId = req.body.userId;
    const noteId = req.body.noteId;

    // check for id
    if (userId === '' || userId === null || noteId === '' || noteId === null) {
        res.status(400).json({
            "request_error": "id not set",
            "request_status": "400 Bad request"
        }).end();
        return;
    }

    // delete from db
    try {
        await User.updateOne({_id:userId}, {
            $pull: {
                todos: {_id:noteId}
            }
        })
        res.status(200).end();
    } catch (e) {
        res.status(500).end();
        console.log('Server error on request: ' + e);
    }

}

exports.putReq = async (req, res) => {

    // check for api key
    if (req.body.api_key !== local_api_key) {
        res.status(401).json({
            "request_error": "api_key not correct",
            "request_status": "401 Unauthorized"
        }).end();
        return;
    }

    const userId = req.body.userId;
    const noteId = req.body.noteId;
    const text = req.body.content;

    // check for id
    if (userId === '' || userId === null || noteId === '' || noteId === null) {
        res.status(400).json({
            "request_error": "id not set",
            "request_status": "400 Bad request"
        }).end();
        return;
    }

    // update todo
    try {
        await User.updateOne({_id:userId, "todos._id": noteId}, {
            $set: {
                "todos.$.text": text
            }
        })
        res.status(200).end();
    } catch (e) {
        res.status(500).end();
        console.log('Server error on request: ' + e);
    }
}
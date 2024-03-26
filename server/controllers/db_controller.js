const Todo = require('../models/db_schema');

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

    // post data
    if (reqType === 'POST') {

        // get content
        const text = req.body.content;

        // check content
        if (text === null || text === '') {
            res.status(400).end();
            return;
        }

        // try posting to db
        try {
            const todo = new Todo({
                text: text
            });

            const save = await todo.save();
            res.json(save);

            res.status(200).end();
        } catch (e) {
            res.status(500).end();
            console.log('Server error on request: ' + e);
        }

    // get data
    } else if (reqType === 'GET') {
        try {
            const todos = await Todo.find({});
            res.status(200).json(todos).end();
        } catch (e) {
            res.status(500).end();
            console.log('Server error on request: ' + e);
        }


    // on invalid type
    } else {
        res.status(400).json({
            "request_error": "request_type missing or incorrect.",
            "request_types": [
                "POST",
                "GET"
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

    // check for id
    if (req.body.id === '' || req.body.id === null) {
        res.status(400).json({
            "request_error": "id not set",
            "request_status": "400 Bad request"
        }).end();
        return;
    }

    const id = req.body.id;

    // delete from db
    try {
        await Todo.deleteOne({'_id':id});
        res.status(200).end();
    } catch (e) {
        res.status(500).end();
        console.log('Server error on request: ' + e);
    }

}
const mong = require('mongoose');

// schema
const todoSchema = new mong.Schema({
    text: {
        type: String,
        required: true
    }
});

// model
const Todo = mong.model('Todo', todoSchema, 'todos');

// export
module.exports = Todo;
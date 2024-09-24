const mong = require('mongoose');

// // schema
// const todoSchema = new mong.Schema({
//     text: {
//         type: String,
//         required: true
//     }
// });

// // model
// const Todo = mong.model('Todo', todoSchema, 'todos');

// // export
// module.exports = Todo;


// user schema
const userSchema = new mong.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    todos: [{
        id: {
            type: mong.Types.ObjectId
        },
        text: {
            type: String,
            required: true
        }
    }]
})

// model
const User = mong.model('User', userSchema, 'users');

module.exports = User;
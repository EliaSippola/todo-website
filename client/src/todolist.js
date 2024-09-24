import React from "react";
import { removeTodo } from "./api/users";

function Todolist({ values, forceUpdate, user, setEdit, setText }) {

    const handleDelete = (e) => {
        if (window.confirm("Delete todo?") === true) {
            finalizeDelete(e);
        }
    }

    const finalizeDelete = async (e) => {
        await removeTodo(user[0], e.target.dataset.id);
        setEdit('');
        setText('');
        forceUpdate(1);
    }

    const handleEdit = async (e) => {
        setEdit(e.target.dataset.id);
        setText(e.target.dataset.text);
        forceUpdate(3);
    }

    return (
        <div className="todo-container">
            {values === null ? 
                <div>Loading...</div>
                : values[0].todos.length < 1 ? <div>Nothing to do</div>
                :
                <ul className="todo-list">
                    {values[0].todos.map((val, i) => (
                        <li key={i}>{val.text} <span className="edit" onClick={handleEdit} data-id={val._id} data-text={val.text} >Edit</span> <span className="delete" onClick={handleDelete} data-id={val._id} >X</span></li>
                    ))}
                </ul>
            }
        </div>
    );
}

export default Todolist;
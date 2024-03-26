import React from "react";
import { removeTodo } from "./api/todos";

function Todolist({ values, forceUpdate }) {

    const handleDelete = async (e) => {
        await removeTodo(e.target.dataset.id);
        forceUpdate(1);
    }

    return (
        <div className="todo-container">
            {values === null ? 
                <div>Loading...</div>
                : values.length < 1 ? <div>Nothing to do</div>
                :
                <ul className="todo-list">
                    {values.map((val, i) => (
                        <li key={i}>{val.text} <span className="delete" onClick={handleDelete} data-id={val._id} >X</span></li>
                    ))}
                </ul>
            }
        </div>
    );
}

export default Todolist;
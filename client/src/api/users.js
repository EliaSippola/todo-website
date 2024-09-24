const api_key = process.env.REACT_APP_LOCAL_API_KEY;

const baseUrl = process.env.REACT_APP_API_URL;

// get todos
export const getTodos = async (id) => {

    if (id === '') {
        return null;
    }

    const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify({
            api_key: api_key,
            request_type: 'GET_TODOS',
            userId: id
        })
    });

    if (res == null) {
        return null;
    }
    return res.json();
}

// remove todo
export const removeTodo = async (id, noteId) => {

    if (id === '') {
        return;
    }

    await fetch(baseUrl, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify({
            api_key: api_key,
            userId: id,
            noteId: noteId
        })
    })
}

// create todo
export const createTodo = async (id, text) => {

    if (id === '') {
        return;
    }

    await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify({
            api_key: api_key,
            request_type: 'CREATE_TODO',
            userId: id,
            content: text
        })
    });
}

// modify todo
export const editTodo = async (id, noteId, text) => {

    if (id === '' || noteId === '') {
        return;
    }

    await fetch(baseUrl, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            api_key: api_key,
            userId: id,
            noteId: noteId,
            content: text
        })
    })

}

// get one user
export const checkLogin = async (user, pass) => {
    const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify({
            api_key: api_key,
            request_type: 'CHECK_CREDENTIALS',
            username: user,
            password: pass
        })
    });

    if (!res.ok) {
        return null;
    }

    return res.json();

}

// create user
export const addUser = async (user, pass) => {
    await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify({
            api_key: api_key,
            request_type: 'CREATE_USER',
            username: user,
            password: pass
        })
    });
    return;
}
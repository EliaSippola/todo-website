const api_key = process.env.REACT_APP_LOCAL_API_KEY;

const baseUrl = process.env.REACT_APP_API_URL;

// get todos
export const getTodos = async () => {

    const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify({
            api_key: api_key,
            request_type: 'GET'
        })
    });

    return res.json();

}

// remove todo
export const removeTodo = async (id) => {
    await fetch(baseUrl, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify({
            api_key: api_key,
            id: id
        })
    })
}

// create todo
export const createTodo = async (text) => {
    await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify({
            api_key: api_key,
            request_type: 'POST',
            content: text
        })
    });
}
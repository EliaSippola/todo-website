import { useEffect, useState } from 'react';
import './App.css';
import Todolist from './todolist';
import { createTodo, getTodos, checkLogin, addUser } from './api/todos';

function App() {

  const [update, forceUpdate] = useState(0);
  const [values, setValues] = useState(null);
  const [text, setText] = useState('');
  const [user, setUser] = useState('', '', false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    forceUpdate(1);
  }, []);

  const handleTodoSubmit = async () => {
    await createTodo(text);
    setText('');
    forceUpdate(1);
  }

  const handleLoginSubmit = async () => {
    const login = await checkLogin(user);
    if (login) {
      setUser([user[0],user[1],true]);
      setMessage('');
      forceUpdate(1);
    } else {
      setUser(['','',false]);
      setMessage('Username or password was incorrect!');
    }
  }

  const handleRegisterSubmit = async () => {
    await addUser(user);

    forceUpdate(0);
    setMessage('Register was succesful!');
    setUser(['','',false]);
  }

  const handleChange = (e) => {
    if (e.target.id === "password") {
      setUser([user[0], e.target.value, user[2]]);
      return;
    }
    if (e.target.id === "username") {
      setUser([e.target.value, user[1], user[2]]);
      return;
    }
    if (e.target.id === "newTodo") {
      setText(e.target.value);
    }
  }

  const handleLinkClick = (type) => {

    if (type == 0) {
      forceUpdate(0);
      setUser(['','',false]);
    } else if (type == 1) {
      forceUpdate(2);
      setUser(['','',false]);
    }

  }

  useEffect(() => {
  }, [update]);

  if (update === 1) {
    if (user[2]) {
      const get = async () => {
        const res = await getTodos();
  
        setValues(res);
      }

      get();
    }
    forceUpdate(0);
  }

  return (
    <div className="App">
      {

        update == 2 ? 

        <div>
          <h1>Register</h1>
          <form onSubmit={e => {e.preventDefault();handleRegisterSubmit();}}>
            <input type='text' id='username' placeholder='username' onChange={handleChange} value={user[0]} required></input>
            <input type='password' id='password' placeholder='password' onChange={handleChange} value={user[1]} required></input>
            <button type='submit'>Register</button>
            <p className='link' onClick={() => handleLinkClick(0)}>Back to front page</p>
          </form>
        </div>

        : 

        <div>
          {

          !user[2] ? 

          <div>
            <h1>login</h1>
            <form onSubmit={e => {e.preventDefault();handleLoginSubmit();}}>
              <input type='text' id='username' placeholder='username' onChange={handleChange} value={user[0]} required></input>
              <input type='password' id='password' placeholder='password' onChange={handleChange} value={user[1]} required></input>
              <button type='submit'>Login</button>
            </form>
            <p className='info-text'>{message}</p>
            <p className='link' onClick={() => handleLinkClick(1)}>No account? Register here.</p>
          </div>

          :

          <div>
            <h1>Todos</h1>
            <form onSubmit={e => {e.preventDefault();handleTodoSubmit();}}>
              <input type='text' id="newTodo" placeholder='text' onChange={handleChange} value={text} ></input>
              <button type='submit'>Add</button>
            </form>
            <Todolist values={values} forceUpdate={forceUpdate} />
            <p className='info-text'>{message}</p>
          </div>

        }
      </div>
      }
    </div>
  );
}

export default App;

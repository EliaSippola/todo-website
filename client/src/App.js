import { useEffect, useState } from 'react';
import './App.css';
import Todolist from './todolist';
import { createTodo, getTodos, checkLogin, addUser, editTodo } from './api/users';

function App() {

  const [update, forceUpdate] = useState(0);
  const [values, setValues] = useState(null);
  const [text, setText] = useState('');
  const [user, setUser] = useState('', '', '', false);
  const [message, setMessage] = useState('');
  const [edit, setEdit] = useState('');

  useEffect(() => {
    forceUpdate(1);
  }, []);

  const handleTodoSubmit = async () => {
    await createTodo(user[0], text);
    setText('');
    forceUpdate(1);
  }

  const handleEditSubmit = async () => {
    await editTodo(user[0], edit, text);
    setText('');
    setEdit('');
    forceUpdate(1);
  }

  const handleEditCancel = () => {
    setText('');
    setEdit('');
  }

  const handleLoginSubmit = async () => {
    const login = await checkLogin(user[1], user[2]);
    if (login != null) {
      setUser([login._id,login.username,login.password,true]);
      setMessage('');
      forceUpdate(1);
    } else {
      setUser(['','','',false]);
      setMessage('Username or password was incorrect!');
    }
  }

  const handleRegisterSubmit = async () => {
    await addUser(user[1],user[2]);

    forceUpdate(0);
    setMessage('Register was succesful!');
    setUser(['','','',false]);
  }

  const handleChange = (e) => {
    if (e.target.id === "password") {
      setUser(['',user[1], e.target.value, false]);
      return;
    }
    if (e.target.id === "username") {
      setUser(['', e.target.value, user[2], false]);
      return;
    }
    if (e.target.id === "newTodo") {
      setText(e.target.value);
    }

    if (e.target.id === "editTodo") {
      setText(e.target.value);
    }
  }

  const handleLinkClick = (type) => {

    if (type === 0) {
      forceUpdate(0);
      setUser(['','','',false]);
    } else if (type === 1) {
      forceUpdate(2);
      setUser(['','','',false]);
    }

  }

  useEffect(() => {
    if (update === 1) {
      if (user[2]) {
        const get = async () => {
          const res = await getTodos(user[0]);
    
          setValues(res);
        }
  
        get();
      }
      forceUpdate(0);
    } else if (update === 3) {
      forceUpdate(0);
    }
  }, [update]);

  return (
    <div className="App">
      {

        update === 2 ? 

        <div>
          <h1>Register</h1>
          <form onSubmit={e => {e.preventDefault();handleRegisterSubmit();}}>
            <input type='text' id='username' placeholder='username' onChange={handleChange} value={user[1] || ''} required></input>
            <input type='password' id='password' placeholder='password' onChange={handleChange} value={user[2] || ''} required></input>
            <button type='submit'>Register</button>
            <p className='link' onClick={() => handleLinkClick(0)}>Back to front page</p>
          </form>
        </div>

        :

        <div>
          {

          !user[3] ? 

          <div>
            <h1>login</h1>
            <form onSubmit={e => {e.preventDefault();handleLoginSubmit();}}>
              <input type='text' id='username' placeholder='username' onChange={handleChange} value={user[1] || ''} required></input>
              <input type='password' id='password' placeholder='password' onChange={handleChange} value={user[2] || ''} required></input>
              <button type='submit'>Login</button>
            </form>
            <p className='info-text'>{message}</p>
            <p className='link' onClick={() => handleLinkClick(1)}>No account? Register here.</p>
          </div>

          :

          <div>
            <h1>Todos</h1>

            {
              edit === '' ?
              <form onSubmit={e => {e.preventDefault();handleTodoSubmit();}}>
                <input type='text' id="newTodo" placeholder='add todo' onChange={handleChange} value={text || ''} required ></input>
                <button type='submit' id='add'>Add</button>
              </form>
              :
              <form onSubmit={e => {e.preventDefault();handleEditSubmit();}} onReset={e => {e.preventDefault();handleEditCancel();}}>
                <input type='text' id="editTodo" onChange={handleChange} value={'' || text} required ></input>
                <button type='submit' id='save'>Save</button>
                <button type='reset' id='cancel'>Cancel</button>
              </form>
            }

            <Todolist values={values} forceUpdate={forceUpdate} user={user} setEdit={setEdit} setText={setText} />
            <p className='info-text'>{message}</p>
          </div>

        }
      </div>
      }
    </div>
  );
}

export default App;

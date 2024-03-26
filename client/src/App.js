import { useEffect, useState } from 'react';
import './App.css';
import Todolist from './todolist';
import { createTodo, getTodos } from './api/todos';

function App() {

  const [update, forceUpdate] = useState(0);
  const [values, setValues] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => {
    forceUpdate(1);
  }, []);

  const handleClick = async () => {
    await createTodo(text);
    setText('');
    forceUpdate(1);
  }

  const handleChange = (e) => {
    setText(e.target.value);
  }

  useEffect(() => {
  }, [update]);

  if (update === 1) {
    const get = async () => {
      const res = await getTodos();

      setValues(res);
    }

    get();
    forceUpdate(0);
  }

  return (
    <div className="App">
      <h1>Todo</h1>
      <form onSubmit={e => {e.preventDefault();}}>
        <input type='text' id="newTodo" placeholder='text' onChange={handleChange} value={text} ></input>
        <button type='submit' onClick={handleClick}>Add</button>
      </form>
      <Todolist values={values} forceUpdate={forceUpdate} />
      <p className='info-text'></p>
    </div>
  );
}

export default App;

import "./App.css";
import { useState, useEffect } from "react";
const url = process.env.REACT_APP_API_URL;

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState([]);
  const [openTodosCount, setOpenTodosCount] = useState(0);
  const [isAdd, setIsAdd] = useState(true);
  const [todoToUpdate, setTodoToUpdate] = useState({});

  const getAll = async () => {
    fetch(`${url}api/todo/all`)
      .then((response) => response.json())
      .then((data) => {
        setList(data);
        setOpenTodosCount(data.filter(todo => todo.completed === false).length)
      })
      .catch((err) => console.log(err));
  };

  const get = async (todo) => {
    fetch(`${url}api/todo${new URLSearchParams({ id: todo.id })}`)
      .then((response) => response.json())
      .then((data) => {

      })
      .catch((err) => console.log(err));
  };

  const create = async (todo) => {
    fetch(`${url}api/todo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    })
      .then((response) => response.json())
      .then((data) => {
        var updatedList = [...list, data]; 
        setList(updatedList);
        setOpenTodosCount(updatedList.filter(todo => todo.completed === false).length)
      })
      .catch((err) => console.log(err));
  };

  const update = async (todo) => {
    fetch(`${url}api/todo/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    })
      .then(getAll)
      .catch((err) => console.log(err));
  }

  const deleteTodo = async (id) => {
    fetch(`${url}api/todo/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
    .then(getAll) // Hier wird es eine Funktion übergeben getAll()
    .catch((err) => console.log(err));
  }

  useEffect(() => {
    getAll();
  }, []);

  const onTodoAdd = async () => {
    await addTodo();
  }

  const addTodo = async () => {
    setInputValue("");
    if (inputValue !== "") {
      var createdTodo = create({ description: inputValue, completed: false });
      setList([...list, createdTodo]);
    }
  }

  const removeTodo = async (idToRemove) => {
    await deleteTodo(idToRemove);
  };

  const startUpdate = async (todo) => {
    if (isAdd) {
      setTodoToUpdate(todo)
      setInputValue(todo.description)
    } else {
      setInputValue("")
    }
    setIsAdd(!isAdd);
  };

  const onTodoUpdate = async () => {
    var todo = todoToUpdate;
    todoToUpdate.description = inputValue;
    update(todo);
    setIsAdd(true);
    setInputValue("")
  }

  const changeTodoCompletion = async (todo) => {
    todo.completed = !todo.completed;
    update(todo);
  }

  const Items = ({ todos }) => {
    console.log(todos)

    if (!todos)
      return;

    const items = todos.map((item, k) => (
      <li className="list-group-item" key={k}>
        <input className="form-check-input me-1" type="checkbox" defaultChecked={item.completed} value="" onChange={() => { changeTodoCompletion(item)}}></input>
        {item.completed == true
        ? <span style={{ textDecoration: " line-through" }}>{ item.description }</span>
        : <span>{ item.description }</span>}
        <button type="button" className="btn btn-outline-danger float-end m-1" onClick={() => removeTodo(item.id)}>X</button>
        <button type="button" className="btn btn-outline-success float-end m-1" onClick={() => startUpdate(item)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
          </svg>
          </button>
        
      </li>
    ));

    return (
      <>
        <ul className="list-group">{items}</ul>
      </>
    );
  };

  return (
    <div className="container">
      <h1>ToDo App <span class="badge rounded-pill bg-primary">{openTodosCount}</span></h1>
      <div className="mb-3">
        <textarea
          className="form-control" 
          id="to-do-input" 
          placeholder="ToDo hinzufügen..."
          type="text"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />

        <br />

        <div className="d-grid gap-2">
          { 
            isAdd 
              ? <button type="button" className="btn btn-outline-dark btn-lg" onClick={() => onTodoAdd()}>Hinzufügen</button>
              : <button type="button" className="btn btn-outline-dark btn-lg" onClick={() => onTodoUpdate()}>Aktualisieren</button>
          }
        </div>

        <br />
        <br />

        <Items todos={list} />
      </div>
    </div>
  );
};
export default App;

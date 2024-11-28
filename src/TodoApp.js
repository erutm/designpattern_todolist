import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Auth.css';

function TodoApp({ onLogout }) {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const calculatePriority = (dueDate) => {
    const today = new Date();
    const differenceInTime = new Date(dueDate) - today;
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    if (differenceInDays <= 5) return "High";
    if (differenceInDays <= 12) return "Medium";
    return "Low";
  };

  const addTodo = () => {
    if (newTask && newDueDate) {
      const newTodo = {
        task: newTask,
        priority: calculatePriority(newDueDate),
        dueDate: newDueDate.toLocaleDateString(),
      };
      setTodos([...todos, newTodo]);
      resetForm();
    }
  };

  const editTodo = (index) => {
    const todo = todos[index];
    setNewTask(todo.task);
    setNewDueDate(new Date(todo.dueDate));
    setIsEditing(true);
    setEditingIndex(index); // Set the editing index to the current task
  };

  const saveTodo = () => {
    if (editingIndex !== null && newTask && newDueDate) {
      const updatedTodos = [...todos];
      updatedTodos[editingIndex] = {
        task: newTask,
        priority: calculatePriority(newDueDate),
        dueDate: newDueDate.toLocaleDateString(),
      };
      setTodos(updatedTodos); // Update the task in the todo list
      resetForm();
      setIsEditing(false);
      setEditingIndex(null);
    }
  };

  const resetForm = () => {
    setNewTask('');
    setNewDueDate(null);
  };

  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const sortByPriority = () => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    setTodos([...todos].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]));
  };

  const sortByDate = () => {
    setTodos([...todos].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
  };

  return (
    <div className="todo-app">
      <div className="container">
        <h1>To-Do List</h1>
        <div>
          <input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <DatePicker
            selected={newDueDate}
            onChange={(date) => setNewDueDate(date)}
            placeholderText="Select due date"
            className="date-picker"
          />
          {isEditing ? (
            <button className="add-task" onClick={saveTodo}>Save</button>
          ) : (
            <button className="add-task" onClick={addTodo}>Add</button>
          )}
        </div>
        <div>
          <button className="sort-button" onClick={sortByPriority}>
            Sort by Priority
          </button>
          <button className="sort-button" onClick={sortByDate}>
            Sort by Date
          </button>
        </div>
        <ul>
          {todos.map((todo, index) => (
            <div key={index} className="task-item">
              <div className="todo-details">
                <p>Task: {todo.task}</p>
                <p>Priority: {todo.priority}</p>
                <p>Due Date: {todo.dueDate}</p>
              </div>
              <button onClick={() => editTodo(index)}>Edit</button>
              <button onClick={() => removeTodo(index)}>Remove</button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoApp;

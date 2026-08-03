import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  deleteTodo,
  toggleTodo,
  editTodo,
  setTodos,
  type Todo as TodoItem,
} from "../features/todo/todoSlice";
import type { AppDispatch, RootState } from "../app/store";

const filters = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export function Todo() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
      dispatch(setTodos(JSON.parse(savedTodos) as TodoItem[]));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="todo-app-shell">
      <div className="todo-card">
        <header className="todo-header">
          <div>
            <p className="eyebrow">Daily planner</p>
            <h1>Todo Deck</h1>
          </div>

          <div className="stats">
            <div className="stat-pill">
              <span>Total</span>
              <span>{todos.length}</span>
            </div>
            <div className="stat-pill">
              <span>Done</span>
              <span>{completedCount}</span>
            </div>
          </div>
        </header>

        <div className="todo-form">
          <input
            className="todo-input"
            type="text"
            value={value}
            placeholder="Add a task..."
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim()) {
                dispatch(addTodo({ text: value }));
                setValue("");
              }
            }}
          />
          <button
            className="primary-btn"
            type="button"
            onClick={() => {
              if (!value.trim()) return;
              dispatch(addTodo({ text: value }));
              setValue("");
            }}
          >
            Add task
          </button>
        </div>

        <div className="filter-row">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`filter-btn ${filter === item.key ? "active" : ""}`}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <li className="empty-state">No tasks in this view yet.</li>
          ) : (
            filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <label className="todo-check">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => dispatch(toggleTodo(todo.id))}
                  />
                  <span className="checkmark" />
                </label>

                {editingId === todo.id ? (
                  <div className="todo-edit-row">
                    <input
                      className="todo-edit-input"
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && editingText.trim()) {
                          dispatch(editTodo({ id: todo.id, text: editingText }));
                          setEditingId(null);
                          setEditingText("");
                        }
                      }}
                    />
                  </div>
                ) : (
                  <span className="todo-text">{todo.text}</span>
                )}

                <div className="todo-actions">
                  {editingId === todo.id ? (
                    <>
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => {
                          if (!editingText.trim()) return;
                          dispatch(editTodo({ id: todo.id, text: editingText }));
                          setEditingId(null);
                          setEditingText("");
                        }}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => {
                          setEditingId(null);
                          setEditingText("");
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => {
                          setEditingId(todo.id);
                          setEditingText(todo.text);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => dispatch(deleteTodo(todo.id))}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

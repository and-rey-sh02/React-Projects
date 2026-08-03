import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type TodosState = {
  todos: Todo[];
};

const initialState: TodosState = {
  todos: [],
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<{ text: string }>) {
      state.todos.push({
        id: crypto.randomUUID(),
        text: action.payload.text,
        completed: false,
      });
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    editTodo(state, action: PayloadAction<{ id: string; text: string }>) {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);

      if (todo) {
        todo.text = action.payload.text;
      }
    },
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
    },
  },
});

export const { addTodo, deleteTodo, toggleTodo, editTodo, setTodos } = todosSlice.actions;

export default todosSlice.reducer;

import "./App.css";
import { useMemo, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDeadline, setEditingDeadline] = useState("");

  function handleAddTask(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    const task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      deadline: newDeadline || "",
      createdAt: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
    setNewTitle("");
    setNewDeadline("");
  }

  function handleToggleComplete(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function handleDelete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingTitle("");
      setEditingDeadline("");
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingDeadline(task.deadline || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
    setEditingDeadline("");
  }

  function saveEdit(id) {
    const title = editingTitle.trim();
    if (!title) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, title, deadline: editingDeadline || "" } : t
      )
    );
    cancelEdit();
  }

  const sortedTasks = useMemo(() => {
    // Sort by deadline (empty deadlines last), then by creation time desc
    const copy = [...tasks];
    copy.sort((a, b) => {
      const aHas = Boolean(a.deadline);
      const bHas = Boolean(b.deadline);
      if (aHas && bHas) {
        if (a.deadline < b.deadline) return -1;
        if (a.deadline > b.deadline) return 1;
        return b.createdAt - a.createdAt;
      }
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return b.createdAt - a.createdAt;
    });
    return copy;
  }, [tasks]);

  return (
    <div className="App">
      <h1>TODO Лист</h1>

      <form className="todo-form" onSubmit={handleAddTask}>
        <input
          className="todo-input"
          type="text"
          placeholder="Новая задача..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          className="todo-deadline"
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
        />
        <button className="btn add" type="submit">
          Добавить
        </button>
      </form>

      {sortedTasks.length === 0 ? (
        <p className="muted">Задач пока нет. Добавьте первую!</p>
      ) : (
        <ul className="todo-list">
          {sortedTasks.map((task) => (
            <li key={task.id} className={`todo-item ${task.completed ? "done" : ""}`}>
              <label className="todo-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                />
              </label>

              {editingId === task.id ? (
                <div className="todo-editing">
                  <input
                    className="todo-input edit"
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                  <input
                    className="todo-deadline edit"
                    type="date"
                    value={editingDeadline}
                    onChange={(e) => setEditingDeadline(e.target.value)}
                  />
                </div>
              ) : (
                <div className="todo-content" onDoubleClick={() => startEdit(task)}>
                  <span className="todo-title">{task.title}</span>
                  {task.deadline ? (
                    <span className="todo-date">Дедлайн: {task.deadline}</span>
                  ) : (
                    <span className="todo-date muted">Без дедлайна</span>
                  )}
                </div>
              )}

              <div className="todo-actions">
                {editingId === task.id ? (
                  <>
                    <button className="btn save" onClick={() => saveEdit(task.id)}>Сохранить</button>
                    <button className="btn ghost" onClick={cancelEdit}>Отмена</button>
                  </>
                ) : (
                  <>
                    <button className="btn ghost" onClick={() => startEdit(task)}>Редактировать</button>
                    <button className="btn danger" onClick={() => handleDelete(task.id)}>Удалить</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

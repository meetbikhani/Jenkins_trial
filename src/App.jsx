import { useState, useEffect } from "react";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setTask("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div style={styles.container}>
      <div style={styles.todoBox}>
        <h1 style={styles.heading}>Todo List</h1>

        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter a task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            style={styles.input}
          />

          <button onClick={addTask} style={styles.addBtn}>
            Add
          </button>
        </div>

        <div style={styles.taskList}>
          {tasks.length === 0 ? (
            <p style={styles.emptyText}>No tasks added yet.</p>
          ) : (
            tasks.map((t) => (
              <div key={t.id} style={styles.taskItem}>
                <div
                  onClick={() => toggleTask(t.id)}
                  style={{
                    ...styles.taskText,
                    textDecoration: t.completed
                      ? "line-through"
                      : "none",
                    opacity: t.completed ? 0.6 : 1,
                  }}
                >
                  {t.text}
                </div>

                <button
                  onClick={() => deleteTask(t.id)}
                  style={styles.deleteBtn}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },

  todoBox: {
    width: "100%",
    maxWidth: "500px",
    background: "#1e293b",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  heading: {
    color: "white",
    textAlign: "center",
    marginBottom: "25px",
  },

  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "16px",
  },

  addBtn: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  taskItem: {
    background: "#334155",
    padding: "14px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  taskText: {
    color: "white",
    cursor: "pointer",
    flex: 1,
  },

  deleteBtn: {
    border: "none",
    background: "transparent",
    color: "#ef4444",
    fontSize: "18px",
    cursor: "pointer",
    marginLeft: "10px",
  },

  emptyText: {
    color: "#cbd5e1",
    textAlign: "center",
  },
};
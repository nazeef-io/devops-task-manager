import { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import * as api from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please check that the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      setError(null);
      if (editingTask) {
        await api.updateTask(editingTask._id, formData);
        setEditingTask(null);
      } else {
        await api.createTask(formData);
      }
      await fetchTasks();
    } catch (err) {
      setError('Failed to save task. Please try again.');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await api.deleteTask(id);
      await fetchTasks();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      setError(null);
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await api.updateTaskStatus(task._id, newStatus);
      await fetchTasks();
    } catch (err) {
      setError('Failed to update task status. Please try again.');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>DevOps Task Manager</h1>
      </header>

      <main className="app-main">
        <TaskForm
          onSubmit={handleCreateOrUpdate}
          editingTask={editingTask}
          onCancelEdit={handleCancelEdit}
        />

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <p className="loading-state">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </main>
    </div>
  );
}

export default App;

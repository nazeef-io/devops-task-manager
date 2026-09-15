function TaskItem({ task, onEdit, onDelete, onToggleStatus }) {
  const isCompleted = task.status === 'completed';

  return (
    <li className={`task-item ${isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleStatus(task)}
            title="Mark as completed"
          />
          <h3>{task.title}</h3>
          <span className={`status-badge ${task.status}`}>{task.status}</span>
        </div>

        {task.description && <p className="task-description">{task.description}</p>}

        <div className="task-meta">
          <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
          <span>Updated: {new Date(task.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="task-actions">
        <button className="btn btn-small" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;

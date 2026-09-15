const VALID_STATUSES = ['pending', 'completed'];

/**
 * Validates the request body when creating a new task.
 * Title is required; status, if provided, must be a known value.
 */
const validateCreateTask = (req, res, next) => {
  const { title, status } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res
      .status(400)
      .json({ success: false, message: 'Title is required and must be a non-empty string' });
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: 'Status must be either "pending" or "completed"' });
  }

  next();
};

/**
 * Validates the request body when updating a task (PUT).
 * All fields are optional, but if present they must be valid.
 */
const validateUpdateTask = (req, res, next) => {
  const { title, status } = req.body;

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ success: false, message: 'Title must be a non-empty string' });
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: 'Status must be either "pending" or "completed"' });
  }

  next();
};

/**
 * Validates the request body for the dedicated status-update endpoint.
 */
const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: 'Status must be either "pending" or "completed"' });
  }

  next();
};

module.exports = { validateCreateTask, validateUpdateTask, validateStatusUpdate };

const express = require('express');
const router = express.Router();

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/taskController');

const {
  validateCreateTask,
  validateUpdateTask,
  validateStatusUpdate,
} = require('../middleware/validateTask');

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validateCreateTask, createTask);
router.put('/:id', validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', validateStatusUpdate, updateTaskStatus);

module.exports = router;

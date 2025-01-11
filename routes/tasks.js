
const express = require('express');
const { getAllTasks, createTask, getTask, updateTask, deleteTask,getNotes,createNotes} = require('../controllers/tasks');
const authenticateJWT = require('../middleware/authenticateJWT');
const router = express.Router();

// Protect these routes with authenticateJWT middleware
router.get('/', authenticateJWT, getAllTasks);
router.post('/', authenticateJWT, createTask);
router.get('/:id', authenticateJWT, getTask);
router.patch('/:id', authenticateJWT, updateTask);
router.delete('/:id', authenticateJWT, deleteTask);
router.get('/:id', authenticateJWT, getNotes);
router.post('/:id',authenticateJWT, createNotes);


module.exports = router;

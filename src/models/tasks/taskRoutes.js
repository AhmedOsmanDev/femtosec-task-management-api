import express from 'express';
import { addTask, getTasks, updateTask, deleteTask } from './taskController.js';
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, addTask);
router.get('/', authMiddleware, getTasks);
router.patch('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

export default router;

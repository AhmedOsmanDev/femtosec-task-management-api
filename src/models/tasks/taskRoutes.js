import express from 'express';
import { addTask, getTasks, updateTask, deleteTask } from './taskController.js';
import { authHandler } from '../../shared/handlers/authHandler.js';

const router = express.Router();

router.post('/', authHandler, addTask);
router.get('/', authHandler, getTasks);
router.patch('/:id', authHandler, updateTask);
router.delete('/:id', authHandler, deleteTask);

export default router;

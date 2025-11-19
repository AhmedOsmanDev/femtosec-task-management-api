import cors from 'cors';
import express from 'express';
import taskRoutes from './models/tasks/taskRoutes.js';
import userRoutes from './models/users/userRoutes.js';
import { errorHandler } from './shared/handlers/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        message: 'Femto Security Task Management API',
        version: '1.0.0'
    });
});

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.use(errorHandler);

export default app;

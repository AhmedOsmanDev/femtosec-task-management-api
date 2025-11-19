import taskService from './taskService.js';
import logger from '../../shared/logger.js';

export const addTask = async (req, res, next) => {
    try {
        logger.info(`Creating task for user: ${req.user.userId}`);
        logger.debug(`Task data: ${JSON.stringify(req.body)}`);

        const createdTask = await taskService.createTask(req.body, req.user.userId);

        logger.info(`Task created successfully with ID: ${createdTask.id}`);

        res.status(201).json({
            message: 'Task created successfully',
            task: createdTask
        });
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        logger.info(`Fetching tasks for user: ${req.user.userId}, role: ${req.user.role}`);
        logger.debug(`Query filters: ${JSON.stringify(req.query)}`);

        const result = await taskService.getUserTasks(req.user.userId, req.user.role, req.query);

        logger.info(`Retrieved ${result.tasks.length} tasks for user ${req.user.userId}`);

        res.status(200).json({
            message: 'Tasks retrieved successfully',
            ...result
        });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        logger.info(`Updating task ${id} by user: ${req.user.userId}`);
        logger.debug(`Update data: ${JSON.stringify(req.body)}`);

        const updatedTask = await taskService.updateTask(id, req.body, req.user.userId, req.user.role);

        logger.info(`Task ${id} updated successfully`);

        res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        logger.info(`Deleting task ${id} by user: ${req.user.userId}, role: ${req.user.role}`);

        await taskService.deleteTask(id, req.user.userId, req.user.role);

        logger.info(`Task ${id} deleted successfully`);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

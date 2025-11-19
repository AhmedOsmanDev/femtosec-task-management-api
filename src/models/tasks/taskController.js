import taskService from './taskService.js';

export const addTask = async (req, res, next) => {
    try {
        const createdTask = await taskService.createTask(req.body, req.user.userId);

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
        const result = await taskService.getUserTasks(req.user.userId, req.user.role, req.query);

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
        const updatedTask = await taskService.updateTask(id, req.body, req.user.userId, req.user.role);

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
        await taskService.deleteTask(id, req.user.userId, req.user.role);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

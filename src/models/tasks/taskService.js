import httpError from '../../shared/utils/httpError.js';
import task from './TaskModel.js';
import user from '../users/UserModel.js';
import { taskDto } from './taskDto.js';
import { VALID_STATUSES } from './taskStatus.js';
import { isValidDate } from '../../shared/utils/validator.js';
import { USER_ROLES } from '../users/userRoles.js';

class TaskService {
    async createTask(taskData, userId) {
        const { title, description, status, username, dueDate } = taskData;

        if (!title) {
            throw new httpError(400, 'Title is required');
        }
        if (status && !VALID_STATUSES.includes(status)) {
            throw new httpError(400, `Invalid status value. Must be one of: ${VALID_STATUSES.join(', ')}`);
        }
        if (dueDate && !isValidDate(dueDate)) {
            throw new httpError(400, 'Invalid due date format');
        }

        let assignedTo = userId;
        if (username) {
            let assignedUser = await user.findOne({ username });
            assignedTo = assignedUser?._id || null;
        }
        if (!assignedTo) {
            throw new httpError(400, 'Assigned user does not exist');
        }

        const newTask = new task({ title, description, status, assignedTo, dueDate });
        await newTask.save();

        return taskDto(newTask);
    }

    async getUserTasks(userId, userRole, filters) {
        const { page = 1, limit = 10, status } = filters;

        const filter = userRole === USER_ROLES.ADMIN ? {} : { assignedTo: userId };

        if (status) {
            if (!VALID_STATUSES.includes(status)) {
                throw new httpError(400, `Invalid status filter. Must be one of: ${VALID_STATUSES.join(', ')}`);
            }
            filter.status = status;
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        if (pageNum < 1 || limitNum < 1) {
            throw new httpError(400, 'Page and limit must be positive numbers');
        }

        if (limitNum > 100) {
            throw new httpError(400, 'Limit cannot exceed 100');
        }

        const skip = (pageNum - 1) * limitNum;

        const totalTasks = await task.countDocuments(filter);
        const totalPages = Math.ceil(totalTasks / limitNum);

        const tasks = await task.find(filter).skip(skip).limit(limitNum);

        return {
            tasks: tasks.map(taskDto),
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalTasks,
                limit: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            }
        };
    }

    async updateTask(taskId, taskData, userId, userRole) {
        const { title, description, status, username, dueDate } = taskData;

        if (status && !VALID_STATUSES.includes(status)) {
            throw new httpError(400, `Invalid status value. Must be one of: ${VALID_STATUSES.join(', ')}`);
        }
        if (dueDate && !isValidDate(dueDate)) {
            throw new httpError(400, 'Invalid due date format');
        }

        const existingTask = await task.findById(taskId);
        if (!existingTask) {
            throw new httpError(404, 'Task not found');
        }

        if (userRole !== USER_ROLES.ADMIN && existingTask.assignedTo.toString() !== userId) {
            throw new httpError(403, 'Unauthorized to update this task');
        }
        let assignedTo = existingTask.assignedTo;
        if (username) {
            let assignedUser = await user.findOne({ username });
            assignedTo = assignedUser?._id || null;
        }

        const updatedTask = await task.findByIdAndUpdate(
            taskId,
            { title, description, status, assignedTo, dueDate },
            { new: true, runValidators: true }
        );

        return taskDto(updatedTask);
    }

    async deleteTask(taskId, userId, userRole) {
        const existingTask = await task.findById(taskId);

        if (!existingTask) {
            throw new httpError(404, 'Task not found');
        }

        if (userRole !== USER_ROLES.ADMIN && existingTask.assignedTo.toString() !== userId) {
            throw new httpError(403, 'Unauthorized to delete this task');
        }

        await task.deleteOne(existingTask);
    }
}

export default new TaskService();

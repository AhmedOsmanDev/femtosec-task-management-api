import httpError from '../../shared/httpError.js';
import logger from '../../shared/logger.js';
import mongoose from 'mongoose';
import task from './TaskModel.js';
import user from '../users/UserModel.js';
import { taskDto } from './taskDto.js';
import { VALID_STATUSES } from './taskStatus.js';
import { isValidDate } from '../../shared/validator.js';
import { USER_ROLES } from '../users/userRoles.js';

class TaskService {
    async createTask(taskData, userId) {
        const { title, description, status, username, dueDate } = taskData;

        logger.debug(`Validating task data: title=${title}, status=${status}, username=${username}, dueDate=${dueDate}`);

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
            logger.debug(`Looking up user by username: ${username}`);
            let assignedUser = await user.findOne({ username });
            assignedTo = assignedUser?._id || null;
            logger.debug(`User lookup result: ${assignedUser ? `found ${assignedUser._id}` : 'not found'}`);
        }
        if (!assignedTo) {
            throw new httpError(400, 'Assigned user does not exist');
        }

        logger.info(`Creating new task assigned to user: ${assignedTo}`);
        const newTask = new task({ title, description, status, assignedTo, dueDate });
        await newTask.save();
        logger.info(`Task saved to database with ID: ${newTask._id}`);

        return taskDto(newTask);
    }

    async getUserTasks(userId, userRole, filters) {
        const { page = 1, limit = 10, status } = filters;

        logger.debug(`Building query filter for role: ${userRole}, status: ${status || 'all'}`);
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
        logger.debug(`Pagination: page=${pageNum}, limit=${limitNum}, skip=${skip}`);

        logger.info(`Counting tasks with filter: ${JSON.stringify(filter)}`);
        const totalTasks = await task.countDocuments(filter);
        const totalPages = Math.ceil(totalTasks / limitNum);

        logger.info(`Fetching tasks from database: total=${totalTasks}, pages=${totalPages}`);
        const tasks = await task.find(filter).skip(skip).limit(limitNum).populate('assignedTo', 'username');

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

        logger.debug(`Validating update data: status=${status}, username=${username}, dueDate=${dueDate}`);

        if (status && !VALID_STATUSES.includes(status)) {
            throw new httpError(400, `Invalid status value. Must be one of: ${VALID_STATUSES.join(', ')}`);
        }
        if (dueDate && !isValidDate(dueDate)) {
            throw new httpError(400, 'Invalid due date format');
        }

        logger.info(`Finding task with ID: ${taskId}`);
        const existingTask = await task.findById(taskId);
        if (!existingTask) {
            throw new httpError(404, 'Task not found');
        }

        logger.debug(`Checking authorization for user: ${userId}, role: ${userRole}`);
        if (userRole !== USER_ROLES.ADMIN && existingTask.assignedTo.toString() !== userId) {
            throw new httpError(403, 'Unauthorized to update this task');
        }

        let assignedTo = existingTask.assignedTo;
        if (username) {
            logger.debug(`Looking up new assignee by username: ${username}`);
            let assignedUser = await user.findOne({ username });
            assignedTo = assignedUser?._id || null;
            logger.debug(`Assignee lookup result: ${assignedUser ? `found ${assignedUser._id}` : 'not found'}`);
        }

        logger.info(`Updating task ${taskId} in database`);
        const updatedTask = await task.findByIdAndUpdate(
            taskId,
            { title, description, status, assignedTo, dueDate },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'username');

        return taskDto(updatedTask);
    }

    async deleteTask(taskId, userId, userRole) {
        logger.debug(`Validating task ID format: ${taskId}`);
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new httpError(400, 'Invalid task ID format');
        }

        logger.info(`Finding task with ID: ${taskId}`);
        const existingTask = await task.findById(taskId);
        if (!existingTask) {
            throw new httpError(404, 'Task not found');
        }

        logger.debug(`Checking authorization for user: ${userId}, role: ${userRole}`);
        if (userRole !== USER_ROLES.ADMIN && existingTask.assignedTo.toString() !== userId) {
            throw new httpError(403, 'Unauthorized to delete this task');
        }

        logger.info(`Deleting task ${taskId} from database`);
        await task.deleteOne(existingTask);
    }
}

export default new TaskService();

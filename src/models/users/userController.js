import logger from '../../shared/logger.js';
import userService from './userService.js';

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, role } = req.body;
        logger.info(`Registration request received for username: ${username}, email: ${email}`);
        logger.debug(`Registration data: ${JSON.stringify({ username, email, role: role || 'default' })}`);

        const createdUser = await userService.createUser(req.body);

        logger.info(`User ${createdUser.username} registered successfully with ID: ${createdUser.id}`);

        res.status(201).json({
            message: 'User registered successfully',
            user: createdUser
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        logger.info(`Login request received for email: ${email}`);

        const result = await userService.login(req.body);

        logger.info(`User ${result.user.username} logged in successfully`);

        res.status(200).json({
            message: 'Login successful',
            ...result
        });
    } catch (error) {
        next(error);
    }
};

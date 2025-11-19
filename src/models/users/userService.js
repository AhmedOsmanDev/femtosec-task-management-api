import httpError from '../../shared/httpError.js';
import logger from '../../shared/logger.js';
import user from './UserModel.js';
import jwt from 'jsonwebtoken';
import { userDto } from './userDto.js';
import { isValidEmail, isValidPassword } from '../../shared/validator.js';
import { VALID_ROLES, USER_ROLES } from './userRoles.js';

class UserService {
    async createUser(userData) {
        const { firstName, lastName, username, email, password, role } = userData;

        logger.debug(`Validating user registration data: username=${username}, email=${email}, role=${role || 'default'}`);

        if (!firstName || !lastName || !username || !email || !password) {
            throw new httpError(400, 'All fields are required');
        }
        if (!isValidEmail(email)) {
            throw new httpError(400, 'Invalid email format');
        }
        if (!isValidPassword(password)) {
            throw new httpError(400, 'Password must be at least 6 characters long');
        }
        if (role && !VALID_ROLES.includes(role)) {
            throw new httpError(400, `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
        }

        logger.info(`Checking for existing user with email: ${email} or username: ${username}`);
        const existingUser = await user.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            logger.warn(`Registration attempt failed: User already exists (email or username conflict)`);
            throw new httpError(409, 'User already exists');
        }

        logger.info(`Creating new user: ${username} with role: ${role || USER_ROLES.NORMAL_USER}`);
        const newUser = new user({ firstName, lastName, username, email, password, role: role || USER_ROLES.NORMAL_USER });
        await newUser.save();
        logger.info(`User created successfully with ID: ${newUser._id}`);

        return userDto(newUser);
    }

    async login(credentials) {
        const { email, password } = credentials;

        logger.debug(`Login attempt for email: ${email}`);

        if (!email || !password) {
            throw new httpError(400, 'Email and password are required');
        }
        if (!isValidEmail(email)) {
            throw new httpError(400, 'Invalid email format');
        }
        if (!isValidPassword(password)) {
            throw new httpError(400, 'Password must be at least 6 characters long');
        }

        logger.info(`Looking up user by email: ${email}`);
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            logger.warn(`Login failed: User not found for email: ${email}`);
            throw new httpError(401, 'Invalid email or password');
        }

        logger.debug(`Verifying password for user: ${existingUser.username}`);
        const isPasswordValid = await existingUser.comparePassword(password);
        if (!isPasswordValid) {
            logger.warn(`Login failed: Invalid password for user: ${existingUser.username}`);
            throw new httpError(401, 'Invalid email or password');
        }

        logger.info(`Generating JWT token for user: ${existingUser.username} (ID: ${existingUser._id})`);
        const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email, username: existingUser.username, role: existingUser.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        logger.info(`User ${existingUser.username} logged in successfully`);

        return { token, user: userDto(existingUser) };
    }
}

export default new UserService();

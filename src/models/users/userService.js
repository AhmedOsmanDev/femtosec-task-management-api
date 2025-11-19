import httpError from '../../shared/utils/httpError.js';
import user from './UserModel.js';
import jwt from 'jsonwebtoken';
import { userDto } from './userDto.js';
import { isValidEmail, isValidPassword } from '../../shared/utils/validator.js';
import { VALID_ROLES, USER_ROLES } from './userRoles.js';

class UserService {
    async createUser(userData) {
        const { firstName, lastName, username, email, password, role } = userData;

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

        const existingUser = await user.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            throw new httpError(409, 'User already exists');
        }

        const newUser = new user({ firstName, lastName, username, email, password, role: role || USER_ROLES.NORMAL_USER });
        await newUser.save();

        return userDto(newUser);
    }

    async login(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
            throw new httpError(400, 'Email and password are required');
        }

        if (!isValidEmail(email)) {
            throw new httpError(400, 'Invalid email format');
        }

        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            throw new httpError(401, 'Invalid email or password');
        }
        const isPasswordValid = await existingUser.comparePassword(password);
        if (!isPasswordValid) {
            throw new httpError(401, 'Invalid email or password');
        }

        const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email, username: existingUser.username, role: existingUser.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return { token, user: userDto(existingUser) };
    }
}

export default new UserService();

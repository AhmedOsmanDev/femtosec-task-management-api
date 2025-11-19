import userService from './userService.js';

export const registerUser = async (req, res, next) => {
    try {
        const createdUser = await userService.createUser(req.body);

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
        const result = await userService.login(req.body);

        res.status(200).json({
            message: 'Login successful',
            ...result
        });
    } catch (error) {
        next(error);
    }
};

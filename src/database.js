import mongoose from 'mongoose';
import logger from './shared/logger.js';

export const connectDatabase = async (uri) => {
    try {
        await mongoose.connect(uri);
        logger.info('Connected to MongoDB');

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.info('MongoDB disconnected');
        });
    } catch (err) {
        logger.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};

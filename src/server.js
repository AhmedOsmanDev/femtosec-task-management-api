import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase } from './database.js';
import logger from './shared/logger.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

connectDatabase(MONGODB_URI).then(() => {
    app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`);
    });
});

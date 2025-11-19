import mongoose from 'mongoose';
import { VALID_STATUSES, TASK_STATUS } from './taskStatus.js';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: VALID_STATUSES,
        default: TASK_STATUS.PENDING,
        index: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    dueDate: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model('task', taskSchema);

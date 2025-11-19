export const taskDto = (task) => ({
    _id: task._id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
    username: task.assignedTo.username
});

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate);
};

export const isValidPassword = (password) => {
    return password && password.length >= 6;
};
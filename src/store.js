const fs = require('fs');
const {getConfigKey} = require("./options");
const path = __dirname + '/../database.json';

const check = () => {
    if (!fs.existsSync(path)) save({});
};

const save = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
};

const get = () => {
    check();
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
};

const saveUser = (user) => {
    let data = get();
    if (!data.users) data.users = [];
    data.users.push(user);
    save(data);
};

const getUsers = () => {
    let data = get();
    return data.users || [];
};

const getUserById = (userId) => {
    let data = get();
    if (data.users) {
        return data.users.find((user) => user.id === userId);
    }
    return null;
};

const removeUserById = (userId) => {
    let data = get();
    if (data.users) {
        data.users = data.users.filter((user) => user.id !== userId);
        save(data);
    }
};

const containsUserById = (userId) => {
    let data = get();
    if (data.users) {
        return data.users.some((user) => user.id === userId);
    }
    return false;
};

const updateUserById = (userId, updatedData) => {
    let data = get();
    if (data.users) {
        const user = data.users.find((user) => user.id === userId);
        if (user) {
            Object.assign(user, updatedData);
            save(data);
            return true;
        }
    }
    return false;
};

const saveMessage = (userMessage, botMessage) => {
    let data = get();
    if (!data.messages) data.messages = [];
    data.messages.push({userMessage, botMessage});
    save(data);
};

const getBotMessage = (userMessage) => {
    let data = get();
    if (data.messages) {
        const message = data.messages.find((target) => target.userMessage === userMessage);
        return message ? message.botMessage : null;
    }
    return null;
};

const removeMessage = (userMessage) => {
    let data = get();
    if (data.messages) {
        data.messages = data.messages.filter((message) => message.userMessage !== userMessage);
        save(data);
    }
};

const containsMessage = (userMessage) => {
    let data = get();
    if (data.messages) {
        return data.messages.some((message) => message.userMessage === userMessage);
    }
    return false;
};

const increaseUserRating = (userId, amount = getConfigKey("increaseAmount")) => {
    let data = get();
    if (data.users) {
        let user = data.users.find((user) => user.id === userId);
        if (!user) {
            user = {id: userId, rating: 0, experience: 0};
            data.users.push(user);
        }
        user.rating = user.rating + amount;
        save(data);
        return true;
    }
    return false;
};

const decreaseUserRating = (userId, amount = getConfigKey("increaseAmount")) => {
    let data = get();
    if (data.users) {
        let user = data.users.find((user) => user.id === userId);
        if (!user) {
            user = {id: userId, rating: 0, experience: 0};
            data.users.push(user);
        }
        user.rating = user.rating - amount;
        save(data);
        return true;
    }
    return false;
};


module.exports = {
    check,
    save,
    get,
    saveUser,
    getUsers,
    getUserById,
    removeUserById,
    containsUserById,
    updateUserById,
    saveMessage,
    getBotMessage,
    removeMessage,
    containsMessage,
    increaseUserRating,
    decreaseUserRating
};

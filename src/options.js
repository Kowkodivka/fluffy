const fs = require('fs');

function getConfigKey(key) {
    const config = JSON.parse(fs.readFileSync('../config.json', 'utf-8'));
    return key.split('.').reduce((value, k) => value && value[k], config);
}

function setConfigKey(key, value) {
    const config = JSON.parse(fs.readFileSync('../config.json', 'utf-8'));
    const keys = key.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, k) => obj[k] = obj[k] || {}, config);
    target[lastKey] = value;
    fs.writeFileSync('../config.json', JSON.stringify(config, null, 2));
}

function getAllConfigKeys() {
    const config = JSON.parse(fs.readFileSync('../config.json', 'utf-8'));

    function traverse(obj, path = '') {
        return Object.entries(obj).reduce((result, [key, value]) => {
            const fullPath = path ? `${path}.${key}` : key;
            if (typeof value === 'object') {
                return [...result, ...traverse(value, fullPath)];
            } else if (!fullPath.includes('secret')) {
                return [...result, {key: fullPath, value}];
            }
            return result;
        }, []);
    }

    return traverse(config);
}

module.exports = {getConfigKey, setConfigKey, getAllConfigKeys};

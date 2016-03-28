const path = require('path');

var fallbackSettings;

try {
    fallbackSettings = require('../fallback_settings');
} catch (e) {}

exports.FRONTEND_PORT = process.env.CLASS_PORT || fallbackSettings.FRONTEND_PORT;
exports.REDIS_SECRET = process.env.CLASS_REDIS_SECRET || fallbackSettings.REDIS_SECRET;
exports.REDIS_HOST = process.env.CLASS_REDIS_HOST || fallbackSettings.REDIS_HOST;
exports.REDIS_PORT = process.env.CLASS_REDIS_PORT || fallbackSettings.REDIS_PORT;
exports.REDIS_AUTH = process.env.CLASS_REDIS_AUTH || fallbackSettings.REDIS_AUTH;
exports.API_URL = process.env.API_URL || fallbackSettings.API_URL;

exports.ROOT_DIRECTORY_PATH = path.resolve(__dirname, '../');

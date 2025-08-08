// Environment configuration
export const API_CONFIG = {
    // API Base URL - defaults to localhost:3000 for development
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',

    // Request timeout in milliseconds
    TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,

    // Auth token storage keys
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'access_token',
        REFRESH_TOKEN: 'refresh_token',
        USER: 'user'
    }
};

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        LOGOUT_ALL: '/auth/logout-all',
        PROFILE: '/auth/profile',
        SESSIONS: '/auth/sessions',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password'
    },
    USERS: {
        LIST: '/users',
        CREATE: '/users',
        GET: (id) => `/users/${id}`,
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
        RESTORE: (id) => `/users/${id}/restore`,
        SESSIONS: (id) => `/users/${id}/sessions`
    },
    HEALTH: '/health'
};

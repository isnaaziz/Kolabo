/**
 * Authentication utilities
 */

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
    try {
        if (!token) return null;

        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (token) => {
    try {
        const decoded = decodeJWT(token);
        if (!decoded || !decoded.exp) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

/**
 * Get token expiration time in milliseconds
 * @param {string} token - JWT token
 * @returns {number|null} Expiration time or null if invalid
 */
export const getTokenExpiration = (token) => {
    try {
        const decoded = decodeJWT(token);
        if (!decoded || !decoded.exp) return null;

        return decoded.exp * 1000; // Convert to milliseconds
    } catch (error) {
        return null;
    }
};

/**
 * Get time remaining until token expiration
 * @param {string} token - JWT token
 * @returns {number} Time remaining in milliseconds (0 if expired)
 */
export const getTokenTimeRemaining = (token) => {
    try {
        const expirationTime = getTokenExpiration(token);
        if (!expirationTime) return 0;

        const currentTime = Date.now();
        const remaining = expirationTime - currentTime;

        return Math.max(0, remaining);
    } catch (error) {
        return 0;
    }
};

/**
 * Format time duration in a human-readable format
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (milliseconds) => {
    if (milliseconds <= 0) return 'Expired';

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and feedback
 */
export const validatePassword = (password) => {
    const feedback = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
        score += 1;
    } else {
        feedback.push('At least 8 characters');
    }

    // Uppercase letter
    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('One uppercase letter');
    }

    // Lowercase letter
    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('One lowercase letter');
    }

    // Number
    if (/\d/.test(password)) {
        score += 1;
    } else {
        feedback.push('One number');
    }

    // Special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score += 1;
    } else {
        feedback.push('One special character');
    }

    return { score, feedback };
};

/**
 * Get password strength text based on score
 * @param {number} score - Password strength score (0-5)
 * @returns {string} Strength description
 */
export const getPasswordStrengthText = (score) => {
    switch (score) {
        case 0:
        case 1:
            return 'Very Weak';
        case 2:
            return 'Weak';
        case 3:
            return 'Fair';
        case 4:
            return 'Good';
        case 5:
            return 'Strong';
        default:
            return 'Unknown';
    }
};

/**
 * Get password strength color class
 * @param {number} score - Password strength score (0-5)
 * @returns {string} CSS color class
 */
export const getPasswordStrengthColor = (score) => {
    switch (score) {
        case 0:
        case 1:
            return 'bg-red-500';
        case 2:
            return 'bg-orange-500';
        case 3:
            return 'bg-yellow-500';
        case 4:
            return 'bg-blue-500';
        case 5:
            return 'bg-green-500';
        default:
            return 'bg-gray-500';
    }
};

import apiClient from '../api';

/**
 * User Service
 * Handles user-related API calls
 */
class UserService {
    /**
     * Get list of users (admin only)
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search term
     * @returns {Promise<Object>} Users list response
     */
    async getUsers(params = {}) {
        try {
            const response = await apiClient.get('/users', { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User data
     */
    async getUserById(userId) {
        try {
            const response = await apiClient.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Create new user
     * @param {Object} userData - User data
     * @returns {Promise<Object>} Created user
     */
    async createUser(userData) {
        try {
            const response = await apiClient.post('/users', userData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Update user
     * @param {string} userId - User ID
     * @param {Object} userData - Updated user data
     * @returns {Promise<Object>} Updated user
     */
    async updateUser(userId, userData) {
        try {
            const response = await apiClient.put(`/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Delete user (soft delete)
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    async deleteUser(userId) {
        try {
            await apiClient.delete(`/users/${userId}`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Restore deleted user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Restored user
     */
    async restoreUser(userId) {
        try {
            const response = await apiClient.put(`/users/${userId}/restore`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get user sessions
     * @param {string} userId - User ID
     * @returns {Promise<Array>} User sessions
     */
    async getUserSessions(userId) {
        try {
            const response = await apiClient.get(`/users/${userId}/sessions`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Logout user sessions
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    async logoutUserSessions(userId) {
        try {
            await apiClient.delete(`/users/${userId}/sessions`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Handle API errors
     * @param {Error} error - Error object
     * @returns {Error} Formatted error
     */
    handleError(error) {
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 400:
                    return new Error(data.message || 'Invalid request data');
                case 401:
                    return new Error(data.message || 'Unauthorized access');
                case 403:
                    return new Error(data.message || 'Access forbidden');
                case 404:
                    return new Error(data.message || 'User not found');
                case 422:
                    if (Array.isArray(data.message)) {
                        return new Error(data.message.join(', '));
                    }
                    return new Error(data.message || 'Validation failed');
                case 429:
                    return new Error('Too many requests. Please try again later.');
                case 500:
                    return new Error('Server error. Please try again later.');
                default:
                    return new Error(data.message || 'An unexpected error occurred');
            }
        } else if (error.request) {
            return new Error('Network error. Please check your connection and try again.');
        } else {
            return new Error(error.message || 'An unexpected error occurred');
        }
    }
}

// Export singleton instance
export default new UserService();

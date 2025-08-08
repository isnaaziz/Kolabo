import apiClient from '../api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
    /**
     * User login
     * @param {Object} credentials - User credentials
     * @param {string} credentials.username - Username or email
     * @param {string} credentials.password - Password
     * @returns {Promise<Object>} Authentication response
     */
    async login(credentials) {
        try {
            const response = await apiClient.post('/auth/login', {
                username: credentials.email || credentials.username,
                password: credentials.password
            });

            const { access_token, refresh_token, user, expires_in } = response.data;

            // Store tokens and user data
            if (access_token) {
                localStorage.setItem('access_token', access_token);
            }
            if (refresh_token) {
                localStorage.setItem('refresh_token', refresh_token);
            }
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            }

            return response.data;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * User registration
     * @param {Object} userData - User registration data
     * @param {string} userData.username - Username
     * @param {string} userData.email - Email
     * @param {string} userData.password - Password
     * @param {string} userData.full_name - Full name (optional)
     * @param {string} userData.phone - Phone number (optional)
     * @returns {Promise<Object>} Registration response
     */
    async register(userData) {
        try {
            const response = await apiClient.post('/auth/register', {
                username: userData.username || userData.email.split('@')[0],
                email: userData.email,
                password: userData.password,
                full_name: userData.fullName || userData.full_name || `${userData.firstName} ${userData.lastName}`.trim(),
                phone: userData.phone
            });

            return response.data;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Refresh access token
    //  * @returns {Promise<Object>} New tokens
    //  */
    // async refreshToken() {
    //     try {
    //         const refreshToken = localStorage.getItem('refresh_token');
    //         if (!refreshToken) {
    //             throw new Error('No refresh token available');
    //         }

    //         const response = await apiClient.post('/auth/refresh', {
    //             refresh_token: refreshToken
    //         });

    //         const { access_token, refresh_token: newRefreshToken } = response.data;

    //         // Update stored tokens
    //         localStorage.setItem('access_token', access_token);
    //         if (newRefreshToken) {
    //             localStorage.setItem('refresh_token', newRefreshToken);
    //         }

    //         return response.data;
    //     } catch (error) {
    //         throw this.handleAuthError(error);
    //     }
    // }

    /**
     * User logout
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await apiClient.post('/auth/logout', {
                    refresh_token: refreshToken
                });
            }
        } catch (error) {
            // Log error but don't throw - we want to clear local storage regardless
            console.error('Logout error:', error);
        } finally {
            // Clear all stored auth data
            this.clearAuthData();
        }
    }

    /**
     * Logout from all sessions
     * @returns {Promise<void>}
     */
    async logoutAll() {
        try {
            await apiClient.post('/auth/logout-all');
        } catch (error) {
            console.error('Logout all error:', error);
        } finally {
            this.clearAuthData();
        }
    }

    /**
     * Get user profile
     * @returns {Promise<Object>} User profile data
     */
    async getProfile() {
        try {
            const response = await apiClient.get('/auth/profile');

            // Update stored user data
            localStorage.setItem('user', JSON.stringify(response.data));

            return response.data;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Get user sessions
     * @returns {Promise<Array>} User sessions
     */
    async getSessions() {
        try {
            const response = await apiClient.get('/auth/sessions');
            return response.data;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Revoke a specific session
     * @param {string} sessionId - Session ID to revoke
     * @returns {Promise<void>}
     */
    async revokeSession(sessionId) {
        try {
            await apiClient.delete(`/auth/sessions/${sessionId}`);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Send password reset email
     * @param {string} email - User's email
     * @returns {Promise<Object>} Reset response
     */
    async forgotPassword(email) {
        try {
            const response = await apiClient.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Reset password with token
     * @param {string} token - Reset token
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} Reset response
     */
    async resetPassword(token, newPassword) {
        try {
            const response = await apiClient.post('/auth/reset-password', {
                token,
                password: newPassword
            });
            return response.data;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        const token = localStorage.getItem('access_token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    }

    /**
     * Get current user from storage
     * @returns {Object|null} Current user data
     */
    getCurrentUser() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    /**
     * Get access token
     * @returns {string|null} Access token
     */
    getAccessToken() {
        return localStorage.getItem('access_token');
    }

    /**
     * Clear all authentication data from storage
     */
    clearAuthData() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }

    /**
     * Handle authentication errors
     * @param {Error} error - Error object
     * @returns {Error} Formatted error
     */
    handleAuthError(error) {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 400:
                    return new Error(data.message || 'Invalid request data');
                case 401:
                    return new Error(data.message || 'Invalid credentials');
                case 403:
                    return new Error(data.message || 'Access forbidden');
                case 404:
                    return new Error(data.message || 'Endpoint not found');
                case 422:
                    // Validation errors
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
            // Network error
            return new Error('Network error. Please check your connection and try again.');
        } else {
            // Other error
            return new Error(error.message || 'An unexpected error occurred');
        }
    }
}

// Export singleton instance
export default new AuthService();

import { tokenStore } from './apiClient';

/**
 * API Service with integrated toast notifications
 * Handles all API calls and automatically shows appropriate toasts
 */
class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.toastContext = null;
    }

    // Set toast context (called from a React component)
    setToastContext(toastContext) {
        this.toastContext = toastContext;
    }

    // Get stored token (updated to use tokenStore if available)
    getToken() {
        try {
            tokenStore.load();
            const t = tokenStore.getAccess();
            if (t) return t;
        } catch { }
        // Fallbacks for legacy storage
        const legacy = localStorage.getItem('token');
        if (legacy) return legacy;
        try {
            const raw = localStorage.getItem('kolabo_tokens');
            if (raw) {
                const obj = JSON.parse(raw);
                return obj.access_token || obj.accessToken || null;
            }
        } catch { }
        return null;
    }

    // Default headers (now always up to date)
    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        const token = this.getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
        return headers;
    }

    // Utility to sync legacy single token (optional)
    syncLegacyToken() {
        try {
            const token = this.getToken();
            if (token) localStorage.setItem('token', token); // keep older parts working
        } catch { }
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            // Handle response based on status
            if (!response.ok) {
                const error = new Error(data.message || 'Request failed');
                error.response = { status: response.status, data };
                throw error;
            }

            return { data, status: response.status };
        } catch (error) {
            // Handle network errors
            if (!error.response) {
                error.response = { status: 0, data: { message: error.message } };
            }
            throw error;
        }
    }

    // Show toast notifications based on operation type
    showOperationToast(operation, response, error) {
        if (!this.toastContext) return;

        if (error) {
            this.toastContext.showApiErrorToast(error);
            return;
        }

        // Success messages based on operation type
        const successMessages = {
            // Auth operations
            login: 'Login successful! Welcome back.',
            logout: 'Logged out successfully.',
            register: 'Account created successfully! Please login.',

            // Task operations
            createTask: 'Task created successfully.',
            updateTask: 'Task updated successfully.',
            deleteTask: 'Task deleted successfully.',
            assignTask: 'Task assigned successfully.',

            // Sprint operations
            createSprint: 'Sprint created successfully.',
            startSprint: 'Sprint started successfully.',
            completeSprint: 'Sprint completed successfully.',
            updateSprint: 'Sprint updated successfully.',

            // Team operations
            inviteMember: 'Team member invited successfully.',
            removeMember: 'Team member removed successfully.',
            updateMember: 'Member details updated successfully.',

            // Project operations
            createProject: 'Project created successfully.',
            updateProject: 'Project updated successfully.',
            deleteProject: 'Project deleted successfully.',

            // Comment operations
            addComment: 'Comment added successfully.',
            updateComment: 'Comment updated successfully.',
            deleteComment: 'Comment deleted successfully.',

            // File operations
            uploadFile: 'File uploaded successfully.',
            deleteFile: 'File deleted successfully.',

            // Settings operations
            updateSettings: 'Settings updated successfully.',
            updateProfile: 'Profile updated successfully.',
            changePassword: 'Password changed successfully.',
        };

        const message = successMessages[operation] || response.data?.message || 'Operation completed successfully.';

        this.toastContext.showSuccessToast(message, {
            duration: 4000
        });
    }

    // Authentication methods
    async login(credentials, showToast = true) {
        const loadingToastId = showToast ? this.toastContext?.showLoadingToast('Signing in...') : null;

        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            // Persist tokens if present (for callers using apiService directly)
            if (response?.data?.access_token) {
                tokenStore.set({
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token
                });
            }

            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('login', response);
            }

            return response;
        } catch (error) {
            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('login', null, error);
            }
            throw error;
        }
    }

    async logout(showToast = true) {
        const loadingToastId = showToast ? this.toastContext?.showLoadingToast('Signing out...') : null;

        try {
            const response = await this.request('/auth/logout', {
                method: 'POST',
            });

            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('logout', response);
            }

            return response;
        } catch (error) {
            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('logout', null, error);
            }
            throw error;
        }
    }

    async register(userData, showToast = true) {
        const loadingToastId = showToast ? this.toastContext?.showLoadingToast('Creating account...') : null;

        try {
            const response = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });

            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('register', response);
            }

            return response;
        } catch (error) {
            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('register', null, error);
            }
            throw error;
        }
    }

    // Task methods
    async createTask(taskData, showToast = true) {
        const loadingToastId = showToast ? this.toastContext?.showLoadingToast('Creating task...') : null;

        try {
            const response = await this.request('/tasks', {
                method: 'POST',
                body: JSON.stringify(taskData),
            });

            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('createTask', response);
            }

            return response;
        } catch (error) {
            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('createTask', null, error);
            }
            throw error;
        }
    }

    async updateTask(taskId, taskData, showToast = true) {
        const loadingToastId = showToast ? this.toastContext?.showLoadingToast('Updating task...') : null;

        try {
            const response = await this.request(`/tasks/${taskId}`, {
                method: 'PUT',
                body: JSON.stringify(taskData),
            });

            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('updateTask', response);
            }

            return response;
        } catch (error) {
            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('updateTask', null, error);
            }
            throw error;
        }
    }

    async deleteTask(taskId, showToast = true) {
        const loadingToastId = showToast ? this.toastContext?.showLoadingToast('Deleting task...') : null;

        try {
            const response = await this.request(`/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('deleteTask', response);
            }

            return response;
        } catch (error) {
            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('deleteTask', null, error);
            }
            throw error;
        }
    }

    // Sprint methods
    async createSprint(sprintData, showToast = true) {
        const loadingToastId = showToast ? this.toastContext?.showLoadingToast('Creating sprint...') : null;

        try {
            const response = await this.request('/sprints', {
                method: 'POST',
                body: JSON.stringify(sprintData),
            });

            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('createSprint', response);
            }

            return response;
        } catch (error) {
            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('createSprint', null, error);
            }
            throw error;
        }
    }

    // Team methods
    async inviteMember(inviteData, showToast = true) {
        const loadingToastId = showToast ? this.toastContext?.showLoadingToast('Sending invitation...') : null;

        try {
            const response = await this.request('/team/invite', {
                method: 'POST',
                body: JSON.stringify(inviteData),
            });

            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('inviteMember', response);
            }

            return response;
        } catch (error) {
            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('inviteMember', null, error);
            }
            throw error;
        }
    }

    // Generic GET method
    async get(endpoint, showErrorToast = true) {
        try {
            const response = await this.request(endpoint, { method: 'GET' });
            return response;
        } catch (error) {
            if (showErrorToast) {
                this.showOperationToast('fetch', null, error);
            }
            throw error;
        }
    }

    // File upload method
    async uploadFile(file, endpoint = '/files/upload', showToast = true) {
        const loadingToastId = showToast ? this.toastContext?.showLoadingToast('Uploading file...') : null;

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                const error = new Error(data.message || 'Upload failed');
                error.response = { status: response.status, data };
                throw error;
            }

            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('uploadFile', { data, status: response.status });
            }

            return { data, status: response.status };
        } catch (error) {
            if (showToast) {
                this.toastContext?.removeToast(loadingToastId);
                this.showOperationToast('uploadFile', null, error);
            }
            throw error;
        }
    }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

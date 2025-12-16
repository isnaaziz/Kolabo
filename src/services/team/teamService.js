import apiClient from '../apiClient';

class TeamService {
    async listMembers() {
        try {
            const response = await apiClient.get('/team/members');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Ambil daftar invites.
     * @param {Object} opts
     * @param {string|null} opts.status - 'pending' | 'accepted' | 'revoked' | 'expired' | null
     * @param {AbortSignal} opts.signal - optional abort (untuk pencarian real-time)
     */
    async listInvites({ status = 'pending', signal } = {}) {
        try {
            const qs = status ? `?status=${status}` : '';
            const response = await apiClient.get(`/team/invites${qs}`, {
                signal
            });
            const data = response.data;

            // Handle different response formats
            if (Array.isArray(data)) return data;
            if (Array.isArray(data.invites)) return data.invites;
            if (data.data && Array.isArray(data.data.invites)) return data.data.invites;
            return [];
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async inviteMember(payload) {
        try {
            const response = await apiClient.post('/team/invite', payload);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async revokeInvite(inviteId) {
        try {
            const response = await apiClient.post('/team/invite/revoke', { inviteId });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async purgeExpired() {
        try {
            const response = await apiClient.post('/team/invites/purge-expired', {});
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async resendInvite(inviteId) {
        try {
            const response = await apiClient.post('/team/invite/resend', { inviteId });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async acceptInvite(payload) {
        try {
            const response = await apiClient.post('/team/invite/accept', payload);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateRole(id, role) {
        try {
            const response = await apiClient.put(`/team/members/${id}/role`, { role });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async removeMember(id) {
        try {
            const response = await apiClient.delete(`/team/members/${id}`);
            return response.data;
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
                    return new Error(data.message || 'Resource not found');
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
                    return new Error(data.message || `Request failed with status ${status}`);
            }
        } else if (error.request) {
            return new Error('Network error. Please check your connection.');
        } else {
            return new Error(error.message || 'An unexpected error occurred');
        }
    }
}

export const teamService = new TeamService();
export default teamService;
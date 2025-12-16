import apiService from '../apiService';

class ProjectService {
    async getProjects() {
        return apiService.get('/projects');
    }

    async getProject(id) {
        return apiService.get(`/projects/${id}`);
    }

    async createProject(projectData) {
        return apiService.request('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    }

    async updateProject(id, projectData) {
        return apiService.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(projectData)
        });
    }

    async deleteProject(id) {
        return apiService.request(`/projects/${id}`, {
            method: 'DELETE'
        });
    }

    async getBoard(projectId) {
        return apiService.get(`/projects/${projectId}/board`);
    }
}

export default new ProjectService();

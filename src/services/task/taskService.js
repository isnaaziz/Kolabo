import apiService from '../apiService';

class TaskService {
    async getTasks(projectId) {
        return apiService.get(`/tasks?project_id=${projectId}`);
    }

    async getTask(id) {
        return apiService.get(`/tasks/${id}`);
    }

    async createTask(taskData) {
        return apiService.createTask(taskData);
    }

    async updateTask(id, taskData) {
        return apiService.updateTask(id, taskData);
    }

    async deleteTask(id) {
        return apiService.deleteTask(id);
    }
}

export default new TaskService();

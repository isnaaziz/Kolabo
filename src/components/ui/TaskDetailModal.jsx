import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import taskService from '../../services/task/taskService';

const TaskDetailModal = ({ isOpen, onClose, taskId, onCreate, onUpdate, users }) => {
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (isOpen) {
        if (taskId) {
          try {
            setIsLoading(true);
            const response = await taskService.getTask(taskId);
            const taskData = response.data;

            // Merge with default/mock data for missing fields (comments, etc not yet in backend)
            setTask({
              ...taskData,
              assignee: taskData.assignee ? {
                ...taskData.assignee, // PRESERVE ID and other fields
                name: taskData.assignee.full_name || taskData.assignee.username || 'Unassigned',
                avatar: taskData.assignee.avatar_url || '?',
                email: taskData.assignee.email || ''
              } : { name: 'Unassigned', avatar: '?', email: '' },
              reporter: { name: 'Me', avatar: 'Me', email: 'me@example.com' }, // Mock reporter for now
              comments: [], // Mock comments
              attachments: [], // Mock attachments
              timeTracking: { estimated: '0h', logged: '0h', remaining: '0h' },
              labels: taskData.labels || [],
              project: 'Project', // Mock project name
              sprint: 'Sprint 1' // Mock sprint
            });
          } catch (error) {
            console.error("Failed to load task details", error);
          } finally {
            setIsLoading(false);
          }
          setIsEditing(false);
        } else {
          // Creation mode
          setTask({
            title: '',
            description: '',
            status: 'Backlog',
            priority: 'Medium',
            labels: [],
            assignee: { name: 'Unassigned', avatar: '?' },
            reporter: { name: 'Me', avatar: 'Me' },
            timeTracking: { estimated: '0h', logged: '0h', remaining: '0h' },
            comments: [],
            attachments: []
          });
          setIsEditing(true);
        }
      }
    };
    loadTask();
  }, [isOpen, taskId]);

  const handleClose = () => {
    setIsEditing(false);
    setActiveTab('details');
    onClose();
  };

  const handleSave = () => {
    if (!task.title || task.title.trim() === '') {
      alert('Please enter a task title');
      return;
    }
    if (onCreate && !taskId) {
      onCreate({
        title: task.title,
        description: task.description,
        priority: task.priority,
        // Add other fields as needed
      });
    }
    // If editing existing, we would call onUpdate here
  };

  const handleStatusChange = (newStatus) => {
    setTask(prev => ({ ...prev, status: newStatus }));
    // Ideally map status string to column ID here, but if we just update status field for now:
    // Actually backend expects column_id usually for status change in Kanban, 
    // but we can try just updating status text if backend supports it or we need to find column ID.
    // simpler: assume status update logic is handled by parent or just passing status string is enough if API supports it.
    // Checking KanbanBoard's handleDragEnd, it sends column_id. 
    // We will assume for now we just update local and let user save, OR auto-save.
    // Let's autosave status change if onUpdate exists.
    if (onUpdate && taskId) {
      // We need to map Status Name -> Column ID.
      // But we don't have columns prop here. 
      // We will just pass generic object and let parent handle or backend handle separate status field if it exists.
      // If 'status' is just a label in backend (it is based on kanban column).
      // WARNING: This might not move the card column if we don't send column_id.
      // For now, just firing update.
    }
  };

  const handlePriorityChange = (newPriority) => {
    setTask(prev => ({ ...prev, priority: newPriority }));
    if (onUpdate && taskId) {
      onUpdate(taskId, { priority: newPriority });
    }
  };

  const statusOptions = ['Backlog', 'In Progress', 'Review', 'Done']; // Updated options
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Backlog': return 'bg-secondary-100 text-secondary-700'; // Added Backlog
      case 'To Do': return 'bg-secondary-100 text-secondary-700';
      case 'In Progress': return 'bg-primary-100 text-primary-700';
      case 'Review': return 'bg-warning-100 text-warning-700';
      case 'In Review': return 'bg-warning-100 text-warning-700';
      case 'Done': return 'bg-success-100 text-success-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-secondary-100 text-secondary-700';
      case 'Medium': return 'bg-warning-100 text-warning-700';
      case 'High': return 'bg-error-100 text-error-700';
      case 'Critical': return 'bg-error text-white';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-surface rounded-lg shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            {!taskId ? (
              <span className="text-sm font-bold text-primary">NEW TASK</span>
            ) : (
              <div className="flex items-center space-x-2">
                <Icon name="Square" size={20} color="#64748B" />
                <span className="text-sm text-text-secondary">{task.id}</span>
              </div>
            )}

            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </div>

            {/* ... */}
          </div>
          <div className="flex items-center space-x-2">
            {!taskId && (
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Icon name="Save" size={16} />
                <span>Create Task</span>
              </button>
            )}
            {/* ... buttons */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name={isEditing ? "X" : "Edit"} size={20} />
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Title */}
              <div className="mb-6">
                {isEditing ? (
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
                    onBlur={() => {
                      if (onUpdate && taskId) {
                        onUpdate(taskId, { title: task.title });
                      }
                    }}
                    placeholder="Enter task title"
                    className="w-full text-2xl font-semibold text-text-primary bg-transparent border-b border-border focus:border-primary outline-none pb-2 placeholder-gray-400"
                    autoFocus
                  />
                ) : (
                  <h1 className="text-2xl font-semibold text-text-primary">{task.title}</h1>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-border mb-6">
                <nav className="flex space-x-8">
                  {['details', 'comments', 'attachments'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py - 2 px - 1 border - b - 2 font - medium text - sm transition - colors duration - 200 ${activeTab === tab
                        ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                        } `}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-text-primary mb-3">Description</h3>
                    {isEditing ? (
                      <textarea
                        value={task.description}
                        onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
                        onBlur={() => {
                          if (onUpdate && taskId) {
                            onUpdate(taskId, { description: task.description });
                          }
                        }}
                        rows={4}
                        className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      />
                    ) : (
                      <p className="text-text-secondary leading-relaxed">{task.description}</p>
                    )}
                  </div>

                  {/* Labels */}
                  <div>
                    <h3 className="text-sm font-medium text-text-primary mb-3">Labels</h3>
                    <div className="flex flex-wrap gap-2">
                      {task.labels.map((label, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Time Tracking */}
                  <div>
                    <h3 className="text-sm font-medium text-text-primary mb-3">Time Tracking</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-secondary-50 rounded-lg">
                        <p className="text-xs text-text-secondary">Estimated</p>
                        <p className="text-lg font-semibold text-text-primary">{task.timeTracking.estimated}</p>
                      </div>
                      <div className="text-center p-3 bg-primary-50 rounded-lg">
                        <p className="text-xs text-text-secondary">Logged</p>
                        <p className="text-lg font-semibold text-primary">{task.timeTracking.logged}</p>
                      </div>
                      <div className="text-center p-3 bg-warning-50 rounded-lg">
                        <p className="text-xs text-text-secondary">Remaining</p>
                        <p className="text-lg font-semibold text-warning-600">{task.timeTracking.remaining}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {/* Add Comment */}
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">JD</span>
                      </div>
                      <div className="flex-1">
                        <textarea
                          placeholder="Add a comment..."
                          rows={3}
                          className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        />
                        <div className="flex justify-end mt-3">
                          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                            Add Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                      <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-secondary-700">{comment.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-text-primary">{comment.author}</span>
                          <span className="text-xs text-text-secondary">{comment.timestamp}</span>
                        </div>
                        <p className="text-text-secondary">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'attachments' && (
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Icon name="Upload" size={48} color="#CBD5E1" className="mx-auto mb-4" />
                    <p className="text-text-secondary mb-2">Drag and drop files here, or click to browse</p>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                      Choose Files
                    </button>
                  </div>

                  {/* Attachments List */}
                  {task.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                      <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                        <Icon name={attachment.type === 'image' ? 'Image' : 'FileText'} size={20} color="#64748B" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">{attachment.name}</p>
                        <p className="text-sm text-text-secondary">{attachment.size}</p>
                      </div>
                      <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                        <Icon name="Download" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-border bg-secondary-50 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Priority</label>
                <select
                  value={task.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {priorityOptions.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Assignee</label>
                <select
                  value={task.assignee?.id || ''}
                  onChange={(e) => {
                    const userId = e.target.value;
                    const selectedUser = users?.find(u => u.id === userId);
                    if (selectedUser) {
                      setTask(prev => ({
                        ...prev,
                        assignee: {
                          ...(prev.assignee || {}),
                          id: selectedUser.id,
                          name: selectedUser.full_name || selectedUser.username,
                          avatar: selectedUser.avatar_url,
                          username: selectedUser.username
                        }
                      }));
                      if (onUpdate && taskId) {
                        onUpdate(taskId, { assignee_id: userId });
                      }
                    } else if (userId === "") {
                      setTask(prev => ({ ...prev, assignee: null }));
                      if (onUpdate && taskId) {
                        onUpdate(taskId, { assignee_id: null });
                      }
                    }
                  }}
                  className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Unassigned</option>
                  {users?.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name || user.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reporter */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Reporter</label>
                <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-secondary-700">{task.reporter.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{task.reporter.name}</p>
                    <p className="text-xs text-text-secondary">{task.reporter.email}</p>
                  </div>
                </div>
              </div>

              {/* Project & Sprint */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Project</label>
                  <p className="text-sm text-text-secondary">{task.project}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Sprint</label>
                  <p className="text-sm text-text-secondary">{task.sprint}</p>
                </div>
              </div>

              {/* Story Points */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Story Points</label>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{task.storyPoints}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Due Date</label>
                  <p className="text-sm text-text-secondary">{task.dueDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Created</label>
                  <p className="text-sm text-text-secondary">{task.createdAt}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Updated</label>
                  <p className="text-sm text-text-secondary">{task.updatedAt}</p>
                </div>
              </div>



            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={handleClose}
      />
    </div>
  );
};

export default TaskDetailModal;
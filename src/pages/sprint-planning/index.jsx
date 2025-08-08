// src/pages/sprint-planning/index.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import CommandPalette from "../../components/ui/CommandPalette";
import PageHeader from "../../components/ui/PageHeader";
import SprintForm from "./components/SprintForm";
import TaskBacklog from "./components/TaskBacklog";
import SprintCapacityIndicator from "./components/SprintCapacityIndicator";
import VelocityChart from "./components/VelocityChart";
import TaskDetailModal from "../../components/ui/TaskDetailModal";

const SprintPlanning = () => {
  const navigate = useNavigate();
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [backlogTasks, setBacklogTasks] = useState([]);
  const [sprintTasks, setSprintTasks] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    epic: "all",
    priority: "all",
    assignee: "all",
  });
  const [sortOption, setSortOption] = useState("priority");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sprintCapacity, setSprintCapacity] = useState({
    total: 0,
    used: 0,
    remaining: 0,
  });

  // Mock data for sprints
  const sprints = [
    {
      id: 1,
      name: "Sprint 12",
      startDate: "2024-02-15",
      endDate: "2024-02-29",
      goal: "Complete user authentication and dashboard redesign",
      capacity: 120,
      status: "planning",
    },
    {
      id: 2,
      name: "Sprint 13",
      startDate: "2024-03-01",
      endDate: "2024-03-15",
      goal: "Implement analytics dashboard and reporting features",
      capacity: 130,
      status: "upcoming",
    },
  ];

  // Mock data for backlog tasks
  const mockBacklogTasks = [
    {
      id: "TASK-101",
      title: "Implement user authentication system",
      description: "Create a secure authentication system with JWT tokens, password hashing, and session management.",
      storyPoints: 8,
      priority: "High",
      assignee: {
        id: 1,
        name: "John Doe",
        avatar: "JD",
      },
      epic: "User Management",
      status: "Backlog",
      labels: ["Backend", "Security"],
    },
    {
      id: "TASK-102",
      title: "Design dashboard layout",
      description: "Create wireframes and high-fidelity designs for the main dashboard interface.",
      storyPoints: 5,
      priority: "Medium",
      assignee: {
        id: 2,
        name: "Jane Smith",
        avatar: "JS",
      },
      epic: "UI/UX",
      status: "Backlog",
      labels: ["Design", "Frontend"],
    },
    {
      id: "TASK-103",
      title: "Implement API endpoints for user data",
      description: "Create RESTful API endpoints for retrieving and updating user profile information.",
      storyPoints: 5,
      priority: "Medium",
      assignee: {
        id: 3,
        name: "Mike Johnson",
        avatar: "MJ",
      },
      epic: "API Development",
      status: "Backlog",
      labels: ["Backend", "API"],
    },
    {
      id: "TASK-104",
      title: "Create database schema for projects",
      description: "Design and implement the database schema for storing project information and relationships.",
      storyPoints: 3,
      priority: "Low",
      assignee: {
        id: 1,
        name: "John Doe",
        avatar: "JD",
      },
      epic: "Database",
      status: "Backlog",
      labels: ["Database", "Backend"],
    },
    {
      id: "TASK-105",
      title: "Implement task filtering functionality",
      description: "Add the ability to filter tasks by various criteria such as assignee, status, and priority.",
      storyPoints: 5,
      priority: "Medium",
      assignee: {
        id: 4,
        name: "Sarah Williams",
        avatar: "SW",
      },
      epic: "Task Management",
      status: "Backlog",
      labels: ["Frontend", "JavaScript"],
    },
    {
      id: "TASK-106",
      title: "Create user onboarding flow",
      description: "Design and implement the onboarding experience for new users.",
      storyPoints: 8,
      priority: "High",
      assignee: {
        id: 2,
        name: "Jane Smith",
        avatar: "JS",
      },
      epic: "User Experience",
      status: "Backlog",
      labels: ["Design", "Frontend"],
    },
    {
      id: "TASK-107",
      title: "Implement real-time notifications",
      description: "Add WebSocket support for real-time notifications when tasks are updated or assigned.",
      storyPoints: 13,
      priority: "High",
      assignee: {
        id: 3,
        name: "Mike Johnson",
        avatar: "MJ",
      },
      epic: "Notifications",
      status: "Backlog",
      labels: ["Backend", "WebSockets"],
    },
    {
      id: "TASK-108",
      title: "Add task commenting functionality",
      description: "Implement the ability for users to add comments to tasks and receive notifications.",
      storyPoints: 5,
      priority: "Medium",
      assignee: {
        id: 4,
        name: "Sarah Williams",
        avatar: "SW",
      },
      epic: "Collaboration",
      status: "Backlog",
      labels: ["Frontend", "Backend"],
    },
    {
      id: "TASK-109",
      title: "Implement drag-and-drop for Kanban board",
      description: "Add drag-and-drop functionality to the Kanban board for moving tasks between columns.",
      storyPoints: 8,
      priority: "High",
      assignee: {
        id: 1,
        name: "John Doe",
        avatar: "JD",
      },
      epic: "Task Management",
      status: "Backlog",
      labels: ["Frontend", "UX"],
    },
    {
      id: "TASK-110",
      title: "Create analytics dashboard",
      description: "Implement a dashboard showing key metrics and charts for project progress.",
      storyPoints: 13,
      priority: "Medium",
      assignee: {
        id: 3,
        name: "Mike Johnson",
        avatar: "MJ",
      },
      epic: "Analytics",
      status: "Backlog",
      labels: ["Frontend", "Data Visualization"],
    },
  ];

  // Mock data for sprint tasks (initially empty)
  const mockSprintTasks = [];

  // Initialize data
  useEffect(() => {
    setSelectedSprint(sprints[0]);
    setBacklogTasks(mockBacklogTasks);
    setSprintTasks(mockSprintTasks);
    
    // Calculate initial capacity
    if (sprints[0]) {
      const totalCapacity = sprints[0].capacity;
      const usedCapacity = mockSprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
      
      setSprintCapacity({
        total: totalCapacity,
        used: usedCapacity,
        remaining: totalCapacity - usedCapacity,
      });
    }
  }, []);

  // Handle sprint selection
  const handleSprintChange = (sprint) => {
    setSelectedSprint(sprint);
    
    // Update capacity based on selected sprint
    const totalCapacity = sprint.capacity;
    const usedCapacity = sprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
    
    setSprintCapacity({
      total: totalCapacity,
      used: usedCapacity,
      remaining: totalCapacity - usedCapacity,
    });
  };

  // Handle sprint form updates
  const handleSprintUpdate = (updatedSprint) => {
    // In a real app, this would update the sprint in the database
    setSelectedSprint(updatedSprint);
    
    // Update capacity
    setSprintCapacity({
      total: updatedSprint.capacity,
      used: sprintCapacity.used,
      remaining: updatedSprint.capacity - sprintCapacity.used,
    });
  };

  // Handle task selection
  const handleTaskSelect = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  // Handle adding task to sprint
  const handleAddTaskToSprint = (taskId) => {
    const task = backlogTasks.find(task => task.id === taskId);
    if (task) {
      // Check if adding this task would exceed capacity
      if (sprintCapacity.used + task.storyPoints > sprintCapacity.total) {
        // In a real app, you might show a warning or confirmation dialog
        alert("Adding this task would exceed sprint capacity. Consider adjusting points or capacity.");
        return;
      }
      
      // Move task from backlog to sprint
      setBacklogTasks(backlogTasks.filter(t => t.id !== taskId));
      setSprintTasks([...sprintTasks, {...task, status: "Sprint"}]);
      
      // Update capacity
      setSprintCapacity({
        ...sprintCapacity,
        used: sprintCapacity.used + task.storyPoints,
        remaining: sprintCapacity.total - (sprintCapacity.used + task.storyPoints),
      });
    }
  };

  // Handle removing task from sprint
  const handleRemoveTaskFromSprint = (taskId) => {
    const task = sprintTasks.find(task => task.id === taskId);
    if (task) {
      // Move task from sprint to backlog
      setSprintTasks(sprintTasks.filter(t => t.id !== taskId));
      setBacklogTasks([...backlogTasks, {...task, status: "Backlog"}]);
      
      // Update capacity
      setSprintCapacity({
        ...sprintCapacity,
        used: sprintCapacity.used - task.storyPoints,
        remaining: sprintCapacity.total - (sprintCapacity.used - task.storyPoints),
      });
    }
  };

  // Handle bulk task selection
  const handleBulkSelection = (taskIds) => {
    setSelectedTasks(taskIds);
  };

  // Handle bulk task estimation
  const handleBulkEstimation = (points) => {
    // Update story points for selected tasks
    const updatedBacklogTasks = backlogTasks.map(task => {
      if (selectedTasks.includes(task.id)) {
        return { ...task, storyPoints: points };
      }
      return task;
    });
    
    setBacklogTasks(updatedBacklogTasks);
    setSelectedTasks([]);
  };

  // Handle bulk task addition to sprint
  const handleBulkAddToSprint = () => {
    // Calculate total points of selected tasks
    const selectedTasksData = backlogTasks.filter(task => selectedTasks.includes(task.id));
    const totalPointsToAdd = selectedTasksData.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
    
    // Check if adding these tasks would exceed capacity
    if (sprintCapacity.used + totalPointsToAdd > sprintCapacity.total) {
      alert("Adding these tasks would exceed sprint capacity. Consider adjusting points or capacity.");
      return;
    }
    
    // Move selected tasks from backlog to sprint
    const tasksToMove = backlogTasks.filter(task => selectedTasks.includes(task.id));
    const updatedTasks = tasksToMove.map(task => ({...task, status: "Sprint"}));
    
    setBacklogTasks(backlogTasks.filter(task => !selectedTasks.includes(task.id)));
    setSprintTasks([...sprintTasks, ...updatedTasks]);
    
    // Update capacity
    setSprintCapacity({
      ...sprintCapacity,
      used: sprintCapacity.used + totalPointsToAdd,
      remaining: sprintCapacity.total - (sprintCapacity.used + totalPointsToAdd),
    });
    
    setSelectedTasks([]);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilterOptions({
      ...filterOptions,
      [filterType]: value,
    });
  };

  // Handle sort changes
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Apply filters and sorting to backlog tasks
  const filteredBacklogTasks = backlogTasks.filter(task => {
    if (filterOptions.epic !== "all" && task.epic !== filterOptions.epic) return false;
    if (filterOptions.priority !== "all" && task.priority !== filterOptions.priority) return false;
    if (filterOptions.assignee !== "all" && task.assignee.id !== parseInt(filterOptions.assignee)) return false;
    return true;
  });

  // Sort filtered tasks
  const sortedBacklogTasks = [...filteredBacklogTasks].sort((a, b) => {
    switch (sortOption) {
      case "priority":
        const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "points":
        return (b.storyPoints || 0) - (a.storyPoints || 0);
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Get unique values for filter dropdowns
  const epics = [...new Set(backlogTasks.map(task => task.epic))];
  const priorities = [...new Set(backlogTasks.map(task => task.priority))];
  const assignees = [...new Set(backlogTasks.map(task => JSON.stringify(task.assignee)))].map(a => JSON.parse(a));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <CommandPalette />
      
      {/* Main Content */}
      <main className="pt-16 pl-60">
        <div className="p-6">
          {/* Page Header */}
          <PageHeader 
            actions={
              <>
                <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors duration-200 flex items-center space-x-2">
                  <Icon name="Calendar" size={18} />
                  <span>View Calendar</span>
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2">
                  <Icon name="Plus" size={18} />
                  <span>New Sprint</span>
                </button>
              </>
            }
          />
          
          {/* Sprint Selection */}
          <div className="bg-surface border border-border rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <label className="text-text-secondary">Current Sprint:</label>
                <select 
                  value={selectedSprint?.id}
                  onChange={(e) => handleSprintChange(sprints.find(s => s.id === parseInt(e.target.value)))}
                  className="border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {sprints.map(sprint => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name} ({new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedSprint?.status === "planning" ?"bg-primary-100 text-primary-700" :"bg-secondary-100 text-secondary-700"
                }`}>
                  {selectedSprint?.status === "planning" ? "Planning" : "Upcoming"}
                </span>
                <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                  <Icon name="MoreHorizontal" size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Panel - Sprint Details */}
            <div className="lg:col-span-2">
              <div className="bg-surface border border-border rounded-lg overflow-hidden">
                {selectedSprint && (
                  <SprintForm 
                    sprint={selectedSprint} 
                    onUpdate={handleSprintUpdate} 
                  />
                )}
                
                {/* Sprint Capacity Indicator */}
                <div className="border-t border-border p-6">
                  <h3 className="text-sm font-medium text-text-primary mb-4">Sprint Capacity</h3>
                  <SprintCapacityIndicator capacity={sprintCapacity} />
                </div>
                
                {/* Velocity Chart */}
                <div className="border-t border-border p-6">
                  <h3 className="text-sm font-medium text-text-primary mb-4">Team Velocity</h3>
                  <VelocityChart />
                </div>
                
                {/* Sprint Tasks */}
                <div className="border-t border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-text-primary">Sprint Tasks</h3>
                    <span className="text-sm text-text-secondary">{sprintTasks.length} tasks</span>
                  </div>
                  
                  {sprintTasks.length === 0 ? (
                    <div className="text-center py-8 bg-secondary-50 rounded-lg border border-border-light">
                      <Icon name="ClipboardList" size={48} color="#CBD5E1" className="mx-auto mb-4" />
                      <p className="text-text-secondary mb-2">No tasks in this sprint yet</p>
                      <p className="text-sm text-text-secondary">Drag tasks from the backlog or use the "Add to Sprint" button</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sprintTasks.map(task => (
                        <div 
                          key={task.id}
                          className="p-4 bg-surface border border-border rounded-lg hover:border-primary hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-mono text-text-secondary">{task.id}</span>
                              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                task.priority === "High" ?"bg-error-100 text-error-700" 
                                  : task.priority === "Medium" ?"bg-warning-100 text-warning-700" :"bg-secondary-100 text-secondary-700"
                              }`}>
                                {task.priority}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-700">{task.storyPoints}</span>
                              </div>
                            </div>
                          </div>
                          
                          <h4 
                            className="text-sm font-medium text-text-primary mb-2 cursor-pointer hover:text-primary transition-colors duration-200"
                            onClick={() => handleTaskSelect(task.id)}
                          >
                            {task.title}
                          </h4>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-secondary-700">{task.assignee.avatar}</span>
                              </div>
                              <span className="text-xs text-text-secondary">{task.assignee.name}</span>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveTaskFromSprint(task.id)}
                              className="text-xs text-error hover:text-error-600 transition-colors duration-200"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Panel - Task Backlog */}
            <div className="lg:col-span-3">
              <div className="bg-surface border border-border rounded-lg overflow-hidden">
                {/* Backlog Header & Filters */}
                <div className="p-6 border-b border-border">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-text-primary mb-3 md:mb-0">Product Backlog</h2>
                    
                    <div className="flex items-center space-x-3">
                      {selectedTasks.length > 0 && (
                        <>
                          <button
                            onClick={handleBulkAddToSprint}
                            className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
                          >
                            Add to Sprint
                          </button>
                          <div className="h-6 border-r border-border"></div>
                        </>
                      )}
                      
                      <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                        <Icon name="RefreshCw" size={18} />
                      </button>
                      <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                        <Icon name="Filter" size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Filter Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-text-secondary mb-1">Epic</label>
                      <select
                        value={filterOptions.epic}
                        onChange={(e) => handleFilterChange("epic", e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="all">All Epics</option>
                        {epics.map(epic => (
                          <option key={epic} value={epic}>{epic}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-text-secondary mb-1">Priority</label>
                      <select
                        value={filterOptions.priority}
                        onChange={(e) => handleFilterChange("priority", e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="all">All Priorities</option>
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-text-secondary mb-1">Assignee</label>
                      <select
                        value={filterOptions.assignee}
                        onChange={(e) => handleFilterChange("assignee", e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="all">All Assignees</option>
                        {assignees.map(assignee => (
                          <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-text-secondary mb-1">Sort By</label>
                      <select
                        value={sortOption}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="priority">Priority</option>
                        <option value="points">Story Points</option>
                        <option value="name">Task Name</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Task Backlog Grid */}
                <TaskBacklog 
                  tasks={sortedBacklogTasks}
                  onTaskSelect={handleTaskSelect}
                  onAddToSprint={handleAddTaskToSprint}
                  onBulkSelection={handleBulkSelection}
                  selectedTasks={selectedTasks}
                  onBulkEstimation={handleBulkEstimation}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Task Detail Modal */}
      <TaskDetailModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskId={selectedTaskId}
      />
    </div>
  );
};

export default SprintPlanning;
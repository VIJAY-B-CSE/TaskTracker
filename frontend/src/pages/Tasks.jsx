import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all tasks and projects
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch tasks. Our GET /api/tasks returns a Page object, so we get elements from "content"
      const tasksRes = await api.get('/tasks');
      setTasks(tasksRes.data.content || []);

      // 2. Fetch projects so we can populate the Project Selection dropdown
      const projectsRes = await api.get('/projects');
      setProjects(projectsRes.data || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleError = (err) => {
    if (err.response && err.response.data && err.response.data.message) {
      setError(err.response.data.message);
    } else if (err.message === 'Network Error' || !err.response) {
      setError('⚠ Cannot connect to the backend server. Please check if your Spring Boot application is running on port 8080.');
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
    setSuccess('');
  };

  // Helper to show success message temporarily
  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  // Date formatter (e.g. "2026-07-10" -> "10 Jul 2026")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Fallback if invalid

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  // Submit task create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Construct backend payload (project is an object referencing ID)
    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
      project: {
        id: Number(projectId),
      },
    };

    try {
      if (editingId) {
        // PUT update
        await api.put(`/tasks/${editingId}`, taskData);
        showSuccess('✔ Task updated successfully');
        setEditingId(null);
      } else {
        // POST create
        await api.post('/tasks', taskData);
        showSuccess('✔ Task saved successfully');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setDueDate('');
      setProjectId('');
      
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  // Mark status as DONE quickly
  const handleMarkDone = async (task) => {
    setError('');
    setSuccess('');
    
    const updatedTask = {
      title: task.title,
      description: task.description,
      status: 'DONE',
      priority: task.priority,
      dueDate: task.dueDate,
      project: task.project ? { id: task.project.id } : null
    };

    try {
      await api.put(`/tasks/${task.id}`, updatedTask);
      showSuccess('✔ Task updated successfully');
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  // Populate form for editing
  const handleEditClick = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate || '');
    setProjectId(task.project ? task.project.id : '');
    
    setError('');
    setSuccess('');
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setStatus('TODO');
    setPriority('MEDIUM');
    setDueDate('');
    setProjectId('');
    setError('');
  };

  // Delete task
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setError('');
      setSuccess('');
      try {
        await api.delete(`/tasks/${id}`);
        showSuccess('✔ Task deleted successfully');
        if (editingId === id) {
          handleCancelEdit();
        }
        fetchData();
      } catch (err) {
        handleError(err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Manage Tasks</h2>

      {/* Alert Banners */}
      {error && <div className="alert alert-danger shadow-sm">{error}</div>}
      {success && <div className="alert alert-success shadow-sm">{success}</div>}

      <div className="row">
        {/* Task Form */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-bold">
              {editingId ? 'Edit Task' : 'Create New Task'}
            </div>
            <div className="card-body">
              {projects.length === 0 ? (
                <div className="alert alert-warning text-center">
                  Please create at least one <strong>Project</strong> before adding a task.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="taskTitle" className="form-label">Task Title</label>
                    <input
                      type="text"
                      id="taskTitle"
                      className="form-control"
                      placeholder="Enter task title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="taskDesc" className="form-label">Description</label>
                    <textarea
                      id="taskDesc"
                      rows="2"
                      className="form-control"
                      placeholder="Enter task description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="taskStatus" className="form-label">Status</label>
                    <select
                      id="taskStatus"
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="TODO">TODO</option>
                      <option value="DOING">DOING</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="taskPriority" className="form-label">Priority</label>
                    <select
                      id="taskPriority"
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="taskDueDate" className="form-label">Due Date</label>
                    <input
                      type="date"
                      id="taskDueDate"
                      className="form-control"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="taskProject" className="form-label">Link to Project</label>
                    <select
                      id="taskProject"
                      className="form-select"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                    >
                      <option value="">-- Select Project --</option>
                      {projects.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {proj.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      {editingId ? 'Update Task' : 'Save Task'}
                    </button>
                    {editingId && (
                      <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Tasks List Table */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-bold">
              Task List
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Project</th>
                      <th>Due Date</th>
                      <th className="text-center">Priority</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center text-primary p-4">
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Loading tasks...
                        </td>
                      </tr>
                    ) : tasks.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted p-4">
                          No tasks available. Create your first task.
                        </td>
                      </tr>
                    ) : (
                      tasks.map((task) => (
                        <tr key={task.id}>
                          <td>
                            <div className="fw-bold">{task.title}</div>
                            <small className="text-muted">{task.description}</small>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {task.project ? task.project.name : 'Unassigned'}
                            </span>
                          </td>
                          <td>{formatDate(task.dueDate)}</td>
                          <td className="text-center">
                            <span className={`badge ${
                              task.priority === 'HIGH' ? 'bg-danger' :
                              task.priority === 'MEDIUM' ? 'bg-warning text-dark' : 'bg-success'
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className={`badge ${
                              task.status === 'DONE' ? 'bg-success' :
                              task.status === 'DOING' ? 'bg-primary' : 'bg-secondary'
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              {task.status !== 'DONE' && (
                                <button
                                  className="btn btn-sm btn-success"
                                  title="Mark as Done"
                                  onClick={() => handleMarkDone(task)}
                                >
                                  Done
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEditClick(task)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteClick(task.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;

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

  // Pagination & Filtering & Sorting State
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const pageSize = 5; // 5 tasks per page is easy to paginate

  // Fetch all tasks and projects
  const fetchData = async () => {
    setLoading(true);
    try {
      // Build query parameters for pageable request
      const params = {
        page: currentPage,
        size: pageSize,
        sort: `dueDate,${sortDirection}`
      };

      if (filterStatus) {
        params.status = filterStatus;
      }
      if (filterPriority) {
        params.priority = filterPriority;
      }

      // 1. Fetch tasks Page response
      const tasksRes = await api.get('/tasks', { params });
      setTasks(tasksRes.data.content || []);
      setTotalPages(tasksRes.data.totalPages || 0);
      setIsFirstPage(tasksRes.data.first);
      setIsLastPage(tasksRes.data.last);

      // 2. Fetch projects for dropdown selection
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
  }, [currentPage, filterStatus, filterPriority, sortDirection]);

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

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  // Helper to format date: e.g. "2026-07-10" -> "10 Jul 2026"
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  // Filter change handlers (resets current page index back to 0)
  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(0);
  };

  const handlePriorityFilterChange = (e) => {
    setFilterPriority(e.target.value);
    setCurrentPage(0);
  };

  const handleSortChange = (e) => {
    setSortDirection(e.target.value);
    setCurrentPage(0);
  };

  // Submit task form (save/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
        await api.put(`/tasks/${editingId}`, taskData);
        showSuccess('✔ Task updated successfully');
        setEditingId(null);
      } else {
        await api.post('/tasks', taskData);
        showSuccess('✔ Task saved successfully');
      }

      // Reset form fields
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

  // Mark task status as DONE directly
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
        {/* Task Form Card */}
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

        {/* Tasks List Card */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-bold">
              Task List
            </div>
            
            <div className="card-body p-0">
              {/* Filter and Sort Toolbar */}
              <div className="p-3 bg-light border-bottom">
                <div className="row g-2">
                  <div className="col-md-4">
                    <label htmlFor="filterStatus" className="form-label small fw-bold text-muted mb-1">Status Filter</label>
                    <select
                      id="filterStatus"
                      className="form-select form-select-sm"
                      value={filterStatus}
                      onChange={handleStatusFilterChange}
                    >
                      <option value="">All Statuses</option>
                      <option value="TODO">TODO</option>
                      <option value="DOING">DOING</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="filterPriority" className="form-label small fw-bold text-muted mb-1">Priority Filter</label>
                    <select
                      id="filterPriority"
                      className="form-select form-select-sm"
                      value={filterPriority}
                      onChange={handlePriorityFilterChange}
                    >
                      <option value="">All Priorities</option>
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="sortDueDate" className="form-label small fw-bold text-muted mb-1">Sort by Due Date</label>
                    <select
                      id="sortDueDate"
                      className="form-select form-select-sm"
                      value={sortDirection}
                      onChange={handleSortChange}
                    >
                      <option value="asc">Ascending (Oldest First)</option>
                      <option value="desc">Descending (Newest First)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Task Table */}
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
                          No tasks found.
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
                                  className="btn btn-sm btn-outline-success"
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

              {/* Pagination Footer */}
              <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
                <button
                  className="btn btn-sm btn-primary"
                  disabled={isFirstPage || loading}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  &laquo; Previous
                </button>
                <span className="text-muted fw-bold">
                  Page {totalPages > 0 ? currentPage + 1 : 0} of {totalPages}
                </span>
                <button
                  className="btn btn-sm btn-primary"
                  disabled={isLastPage || loading}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next &raquo;
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;

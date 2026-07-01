import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all projects when page loads
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.data || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Standard backend/validation error parser
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

  // Submit form for either Creating or Updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const projectData = { name, description };

    try {
      if (editingId) {
        // PUT update
        await api.put(`/projects/${editingId}`, projectData);
        showSuccess('✔ Project updated successfully');
        setEditingId(null);
      } else {
        // POST create
        await api.post('/projects', projectData);
        showSuccess('✔ Project saved successfully');
      }
      
      // Reset form fields and refresh list
      setName('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      handleError(err);
    }
  };

  // Populate form for editing
  const handleEditClick = (project) => {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description);
    setError('');
    setSuccess('');
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setError('');
  };

  // Delete project
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setError('');
      setSuccess('');
      try {
        await api.delete(`/projects/${id}`);
        showSuccess('✔ Project deleted successfully');
        // If we were editing this project, cancel edit mode
        if (editingId === id) {
          handleCancelEdit();
        }
        fetchProjects();
      } catch (err) {
        handleError(err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Manage Projects</h2>

      {/* Alert Banners */}
      {error && <div className="alert alert-danger shadow-sm">{error}</div>}
      {success && <div className="alert alert-success shadow-sm">{success}</div>}

      <div className="row">
        {/* Project Form */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-bold">
              {editingId ? 'Edit Project' : 'Create New Project'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="projectName" className="form-label">Project Name</label>
                  <input
                    type="text"
                    id="projectName"
                    className="form-control"
                    placeholder="Enter project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="projectDesc" className="form-label">Description</label>
                  <textarea
                    id="projectDesc"
                    rows="3"
                    className="form-control"
                    placeholder="Enter project description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update Project' : 'Save Project'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Projects List Table */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-bold">
              Project List
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '10%' }}>ID</th>
                      <th style={{ width: '25%' }}>Name</th>
                      <th style={{ width: '40%' }}>Description</th>
                      <th style={{ width: '25%' }} className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center text-primary p-4">
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Loading projects...
                        </td>
                      </tr>
                    ) : projects.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted p-4">
                          No projects available. Create your first project.
                        </td>
                      </tr>
                    ) : (
                      projects.map((project) => (
                        <tr key={project.id}>
                          <td>{project.id}</td>
                          <td className="fw-bold">{project.name}</td>
                          <td className="text-muted">{project.description}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-warning me-2"
                              onClick={() => handleEditClick(project)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteClick(project.id)}
                            >
                              Delete
                            </button>
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

export default Projects;

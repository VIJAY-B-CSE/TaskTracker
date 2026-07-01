import React from 'react';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border">
        <div className="container-fluid">
          <h1 className="display-4 fw-bold text-primary mb-3">Task Tracker</h1>
          <p className="col-md-10 fs-4 text-muted">
            A simple, full-stack task management application built using:
          </p>
          <ul className="fs-5 text-secondary mb-4 list-unstyled ps-3">
            <li className="d-flex align-items-center mb-2">
              <span className="me-2">💻</span>
              <span><strong>Spring Boot</strong> (REST API Backend)</span>
            </li>
            <li className="d-flex align-items-center mb-2">
              <span className="me-2">⚛️</span>
              <span><strong>React</strong> (Vite + JavaScript Frontend)</span>
            </li>
            <li className="d-flex align-items-center mb-2">
              <span className="me-2">🗄️</span>
              <span><strong>MySQL</strong> (Persistent Relational Database)</span>
            </li>
          </ul>

          <hr className="my-4" />

          <h3 className="h4 fw-bold text-secondary mb-3">Features</h3>
          <div className="row text-muted fs-5 g-3">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="d-flex align-items-start mb-2">
                  <span className="me-2 text-success">✔</span>
                  <span><strong>Project Management</strong> — Create, edit, and delete projects</span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <span className="me-2 text-success">✔</span>
                  <span><strong>Task Management</strong> — Add and assign tasks to projects</span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <span className="me-2 text-success">✔</span>
                  <span><strong>Status Tracking</strong> — Manage task states (TODO, DOING, DONE)</span>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="d-flex align-items-start mb-2">
                  <span className="me-2 text-success">✔</span>
                  <span><strong>Priority & Due Dates</strong> — Set task priorities and deadlines</span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <span className="me-2 text-success">✔</span>
                  <span><strong>Input Validation</strong> — Validate fields on backend and frontend</span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <span className="me-2 text-success">✔</span>
                  <span><strong>Error Handling</strong> — Clear global backend error responses</span>
                </li>
              </ul>
            </div>
          </div>

          <hr className="my-4" />
          <p className="fs-6 text-muted text-center mb-0">
            💡 <em>Use the navigation bar at the top to start managing your projects and tasks.</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

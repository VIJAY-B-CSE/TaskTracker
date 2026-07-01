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
            <li className="mb-2">💻 <strong>Spring Boot</strong> (REST API Backend)</li>
            <li className="mb-2">⚛️ <strong>React</strong> (Vite + JavaScript Frontend)</li>
            <li className="mb-2">🗄️ <strong>MySQL</strong> (Persistent Relational Database)</li>
          </ul>

          <hr className="my-4" />

          <h3 className="h4 fw-bold text-secondary mb-3">Features</h3>
          <div className="row text-muted fs-5 g-3">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-2">✔ <strong>Project Management</strong> — Create, edit, and delete projects</li>
                <li className="mb-2">✔ <strong>Task Management</strong> — Add and assign tasks to projects</li>
                <li className="mb-2">✔ <strong>Status Tracking</strong> — Transition tasks between TODO, DOING, and DONE</li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-2">✔ <strong>Priority & Due Dates</strong> — Categorize task urgencies and deadlines</li>
                <li className="mb-2">✔ <strong>Validation & Safety</strong> — Robust field validation on both backend and frontend</li>
                <li className="mb-2">✔ <strong>Error Handling</strong> — Uniform global exception handling feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

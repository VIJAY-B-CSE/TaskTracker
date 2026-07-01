import React from 'react';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold text-primary">Welcome to Task Tracker!</h1>
          <p className="col-md-8 fs-4 text-muted">
            Manage your projects and tasks seamlessly. This simple dashboard helps you organize your daily workflow.
          </p>
          <hr className="my-4" />
          <p className="fs-6 text-muted">Use the navigation bar above to view projects and tasks.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

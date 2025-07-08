import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: '25rem' }}>
        <h1 className="card-title text-center mb-4">Login</h1>
        <div className="d-grid gap-2">
          <a href="http://localhost:3001/auth/google" className="btn btn-primary btn-lg">
            Login with Google
          </a>
        </div>
        <p className="text-center mt-3 text-muted">
          This is the login page. Implement your login form here.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

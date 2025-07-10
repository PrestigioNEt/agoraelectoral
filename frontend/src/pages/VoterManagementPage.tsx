import React, { useState, useEffect } from 'react';

interface Voter {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

const VoterManagementPage: React.FC = () => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [newVoter, setNewVoter] = useState<Omit<Voter, 'id'> & { id?: string }>({ name: '' });
  const [editingVoterId, setEditingVoterId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const CRM_SERVICE_URL = import.meta.env.VITE_CRM_SERVICE_URL || 'http://localhost:3002'; // URL of your CRM service

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const response = await fetch(`${CRM_SERVICE_URL}/api/votantes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVoters(data);
    } catch (err: unknown) {
      setError(`Failed to fetch voters: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVoter({ ...newVoter, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      let response;
      if (editingVoterId) {
        // Update existing voter
        response = await fetch(`${CRM_SERVICE_URL}/api/votantes/${editingVoterId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVoter),
        });
      } else {
        // Create new voter
        response = await fetch(`${CRM_SERVICE_URL}/api/votantes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVoter),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setMessage(editingVoterId ? 'Voter updated successfully!' : 'Voter added successfully!');
      setNewVoter({ name: '' }); // Clear form
      setEditingVoterId(null);
      fetchVoters(); // Refresh list
    } catch (err: unknown) {
      setError(`Failed to save voter: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
  };

  const handleEdit = (voter: Voter) => {
    setNewVoter(voter);
    setEditingVoterId(voter.id);
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setMessage(null);
    if (!window.confirm('Are you sure you want to delete this voter?')) {
      return;
    }
    try {
      const response = await fetch(`${CRM_SERVICE_URL}/api/votantes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setMessage('Voter deleted successfully!');
      fetchVoters(); // Refresh list
    } catch (err: unknown) {
      setError(`Failed to delete voter: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Voter Management</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-3 mb-4 shadow-sm">
        <h3>{editingVoterId ? 'Edit Voter' : 'Add New Voter'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={newVoter.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={newVoter.email || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone:</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={newVoter.phone || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address:</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={newVoter.address || ''}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingVoterId ? 'Update Voter' : 'Add Voter'}
          </button>
          {editingVoterId && (
            <button type="button" className="btn btn-secondary ms-2" onClick={() => { setNewVoter({ name: '' }); setEditingVoterId(null); }}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <h3>Voter List</h3>
      {voters.length === 0 ? (
        <p>No voters found. Add some above!</p>
      ) : (
        <ul className="list-group">
          {voters.map((voter) => (
            <li key={voter.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{voter.name}</strong> ({voter.email || 'N/A'})
                {voter.phone && <small className="text-muted ms-2">{voter.phone}</small>}
                {voter.address && <small className="text-muted ms-2">{voter.address}</small>}
              </div>
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(voter)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(voter.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VoterManagementPage;
